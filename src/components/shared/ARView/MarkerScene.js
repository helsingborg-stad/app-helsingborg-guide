// @flow
import React, { Component } from "react";
import { ViroARScene, ViroText, ViroConstants } from "react-viro";
import LocationService from "../../../services/locationService";
import { LocationUtils, MapItemUtils, MathUtils } from "../../../utils";
import Marker from "./Marker";

const ARRIVE_DISTANCE = 10;

type Props = {
  arSceneNavigator: any,
};
type State = {
  isInitialized: boolean,
  markers: Array<any>,
};

const ACTIVE_HEIGHT = 1;
const HEIGHT = 0;

export default class MarkerScene extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    const {
      arSceneNavigator: {
        viroAppProps: { items, userLocation, activeMarker, bearing, onArMarkerPressed },
      },
    } = props;

    const markers = items.map((item) => {
      const {
        contentObject: { location: contentLocation },
      } = item;
      const id = MapItemUtils.getIdFromMapItem(item);
      const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;
      const relativePosition = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing);
      const height = active ? ACTIVE_HEIGHT : HEIGHT;
      const position = [relativePosition.x, height, relativePosition.y];
      const arrived = LocationService.getTravelDistance(userLocation.coords, contentLocation) < ARRIVE_DISTANCE;

      return {
        ...item,
        key: id,
        id,
        active,
        arrived,
        position,
        onPress: onArMarkerPressed,
      };
    });

    return { markers };
  }

  state = {
    isInitialized: false,
    markers: [],
  };

  onInitialized = (tracking: ViroConstants) => {
    switch (tracking) {
      case ViroConstants.TRACKING_NORMAL:
        console.log("Tracking initialised");
        this.setState({ isInitialized: true });
        break;
      case ViroConstants.TRACKING_LIMITED:
        console.log("Tracking Limited");
        this.setState({ isInitialized: false });
        break;
      case ViroConstants.TRACKING_NONE:
      default:
        console.log("Tracking uninitialised");
        this.setState({ isInitialized: false });
        break;
    }
  };

  onCameraTransformUpdate = (cameraTransform: any) => {
    const { position: cameraPosition, forward: cameraForward } = cameraTransform;
    const {
      props: {
        arSceneNavigator: {
          viroAppProps: { activeMarker, onDirectionAngleChange },
        },
      },
      state: { markers },
    } = this;

    const active = markers.find((marker) => {
      const markerId = MapItemUtils.getIdFromMapItem(marker);
      const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
      return markerId === selectedMarkerId;
    });

    if (active) {
      const {
        position: [positionX, positionY, positionZ],
      } = active;
      const [cameraX, cameraY, cameraZ] = cameraPosition;
      const [forwardX, forwardY, forwardZ] = cameraForward;

      // calculate and normalize direction from camera to marker position
      const dx = positionX - cameraX;
      const dy = positionY - cameraY;
      const dz = positionZ - cameraZ;
      const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const normalX = dx / dl;
      const normalZ = dz / dl;

      // calculate angle between the camera's forward direction and the direction to the marker
      const cameraAngle = Math.atan2(forwardZ, forwardX);
      const markerAngle = Math.atan2(normalZ, normalX);
      const angleDifference = (MathUtils.PI2 + cameraAngle - markerAngle) % MathUtils.PI2;

      // get the camera's rotation around the x-axis
      const cameraVerticalRotation = Math.atan2(forwardY, forwardZ) * MathUtils.RAD_TO_DEG + 180;

      onDirectionAngleChange({
        angleDifference: angleDifference * MathUtils.RAD_TO_DEG,
        cameraVerticalRotation,
      });
    }
  };

  render() {
    const {
      state: { isInitialized, markers },
      onInitialized,
    } = this;

    return (
      <ViroARScene onTrackingUpdated={onInitialized} onCameraTransformUpdate={this.onCameraTransformUpdate}>
        {!isInitialized ? <ViroText text="Starting AR" /> : markers.map(marker => <Marker {...marker} />)}
      </ViroARScene>
    );
  }
}
