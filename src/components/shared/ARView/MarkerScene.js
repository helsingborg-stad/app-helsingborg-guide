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

const MODIFIER = 5000; // 10000; //Math.log(distance)*1000;
const HEIGHT = 0.5; // 1; //1.5+Math.log(distance/1000);

export default class MarkerScene extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { userLocation, items } = props.arSceneNavigator.viroAppProps;

    this.state = {
      isInitialized: false,
      markers: items.map((item) => {
        const relativePosition = LocationUtils.getLocationRelativePosition(
          userLocation,
          item.contentObject.location.latitude,
          item.contentObject.location.longitude,
        );

        const position = [relativePosition.x * MODIFIER, HEIGHT, relativePosition.y * MODIFIER];

        return {
          ...item,
          position,
        };
      }),
    };
  }

  onInitialized = (tracking: any) => {
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
        position: [px, py, pz],
      } = active;
      const [cx, cy, cz] = cameraPosition;
      const [fx, , fz] = cameraForward;

      const dx = px - cx;
      const dy = py - cy;
      const dz = pz - cz;
      const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const nx = dx / dl;
      const ny = dy / dl;
      const nz = dz / dl;

      const cameraAngle = Math.atan2(fz, fx);
      const markerAngle = Math.atan2(nz, nx);
      const angleDifference = (MathUtils.PI2 + cameraAngle - markerAngle) % MathUtils.PI2;

      onDirectionAngleChange(angleDifference * MathUtils.RAD_TO_DEG);
    }
  };

  render() {
    const {
      state: { isInitialized, markers },
      props: {
        arSceneNavigator: {
          viroAppProps: { userLocation, activeMarker, onArMarkerPressed },
        },
      },
      onInitialized,
    } = this;

    return (
      <ViroARScene onTrackingUpdated={onInitialized} onCameraTransformUpdate={this.onCameraTransformUpdate}>
        {!isInitialized ? (
          <ViroText text="Starting AR" />
        ) : (
          markers.map((marker) => {
            const id = MapItemUtils.getIdFromMapItem(marker);
            const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;
            const arrived = LocationService.getTravelDistance(userLocation.coords, marker.contentObject.location) < ARRIVE_DISTANCE;

            return <Marker key={id} marker={marker} active={active} onPress={onArMarkerPressed} arrived={arrived} />;
          })
        )}
      </ViroARScene>
    );
  }
}
