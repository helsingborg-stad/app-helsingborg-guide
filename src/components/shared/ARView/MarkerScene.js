// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { ViroARScene, ViroText, ViroConstants, ViroNode } from "react-viro";
import { LocationUtils, MapItemUtils, MathUtils } from "../../../utils";
import AnimatedCharacter from "./AnimatedCharacter";
import Marker from "./Marker";
import LocationService from "../../../services/locationService";

import { updateCameraAngles } from "../../../actions/arActions";

type Props = {
  arSceneNavigator: any,
  dispatchCameraUpdateAngles(ARState): void,
};
type State = {
  isInitialized: boolean,
  markers: Array<any>,
  currentVerticalAngle: number,
  currentHorizontalAngleDelta: number,
  selectedMarker: ?any,
};

const ANGLE_THRESHOLD = 10;
const ACTIVE_HEIGHT = 1;
const HEIGHT = 0;

const exceedsThreshold = (a, b) => Math.abs(a - b) >= ANGLE_THRESHOLD;

class MarkerScene extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const {
      arSceneNavigator: {
        viroAppProps: { userLocation, activeMarker },
      },
    } = props;

    const { markers } = state;

    const newMarkers = markers.map((marker) => {
      const {
        contentObject: { location: contentLocation },
      } = marker;
      const arrived = LocationUtils.hasArrivedAtDestination(userLocation, contentLocation);
      const id = MapItemUtils.getIdFromMapItem(marker);
      const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;

      return {
        ...marker,
        active,
        arrived,
      };
    });

    const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
    const selectedMarker = markers.find((marker) => {
      const markerId = MapItemUtils.getIdFromMapItem(marker);
      return markerId === selectedMarkerId;
    });

    return { markers: newMarkers, selectedMarker };
  }

  state = {
    isInitialized: false,
    markers: [],
    selectedMarker: null,
    currentVerticalAngle: 0,
    currentHorizontalAngleDelta: 0,
  };

  componentDidMount() {
    const {
      arSceneNavigator: {
        viroAppProps: { items, userLocation, activeMarker, onArMarkerPressed },
      },
    } = this.props;

    LocationService.getInstance()
      .getCompassBearing()
      .then((bearing) => {
        const markers = items.map((item) => {
          const {
            contentObject: { location: contentLocation },
          } = item;
          const id = MapItemUtils.getIdFromMapItem(item);
          const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;

          const relativePosition = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing);
          const relativePositionFixed = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing);

          const height = active ? ACTIVE_HEIGHT : HEIGHT;
          const position = [relativePosition.x, height, relativePosition.y];
          const positionFixed = [relativePositionFixed.x, 0, relativePositionFixed.y];
          const arrived = LocationUtils.hasArrivedAtDestination(userLocation, contentLocation);

          return {
            ...item,
            key: id,
            id,
            active,
            arrived,
            position,
            positionFixed,
            onPress: onArMarkerPressed,
          };
        });

        const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
        const selectedMarker = markers.find((marker) => {
          const markerId = MapItemUtils.getIdFromMapItem(marker);
          return markerId === selectedMarkerId;
        });

        this.setState({ markers, selectedMarker });
      });
  }

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
          viroAppProps: { activeMarker },
        },
        dispatchCameraUpdateAngles,
      },
      state: { markers, selectedMarker, currentVerticalAngle, currentHorizontalAngleDelta },
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
      const angleDelta = MathUtils.limitPrecision(((MathUtils.PI2 + cameraAngle - markerAngle) % MathUtils.PI2) * MathUtils.RAD_TO_DEG, 2);

      // get the camera's rotation around the x-axis
      const verticalAngle = MathUtils.limitPrecision(Math.atan2(forwardY, forwardZ) * MathUtils.RAD_TO_DEG + 180, 2);

      if (exceedsThreshold(currentHorizontalAngleDelta, angleDelta) || exceedsThreshold(currentVerticalAngle, verticalAngle)) {
        this.setState({ currentHorizontalAngleDelta: angleDelta, currentVerticalAngle: verticalAngle });
        dispatchCameraUpdateAngles({ verticalAngle, angleDelta });
      }

      if (active !== selectedMarker) {
        this.setState({ selectedMarker: active });
      }
    }
  };

  render() {
    const {
      state: { isInitialized, markers, selectedMarker },
      onInitialized,
    } = this;

    return (
      <ViroARScene onTrackingUpdated={onInitialized} onCameraTransformUpdate={this.onCameraTransformUpdate}>
        {!isInitialized ? (
          <ViroText text="Starting AR" />
        ) : (
          <ViroNode>
            {selectedMarker && <AnimatedCharacter markerPosition={selectedMarker.positionFixed} />}
            {markers.map(marker => (
              <Marker {...marker} />
            ))}
          </ViroNode>
        )}
      </ViroARScene>
    );
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  dispatchCameraUpdateAngles: (cameraTransform: Object) => dispatch(updateCameraAngles(cameraTransform)),
});

export default connect(
  null,
  mapDispatch,
)(MarkerScene);
