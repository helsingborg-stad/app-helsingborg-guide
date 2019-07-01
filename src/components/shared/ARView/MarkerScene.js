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
  bearing: number,
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
const PIN_MAX_DISTANCE = 30;
const CAMERA_UPDATE_LIMIT = 4; // Only run the camera update at a quarter rate (for performance reasons)

class MarkerScene extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      arSceneNavigator: {
        viroAppProps: { items, userLocation, activeMarker, onArMarkerPressed },
      },
      bearing,
    } = props;

    const markers = items.map((item) => {
      const {
        contentObject: { location: contentLocation },
      } = item;

      const id = MapItemUtils.getIdFromMapItem(item);
      const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;
      const arrived = LocationUtils.hasArrivedAtDestination(userLocation, contentLocation);

      const distance = LocationUtils.getTravelDistance(userLocation.coords, contentLocation);
      const relativePosition = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing, PIN_MAX_DISTANCE);
      const relativePositionFixed = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing);

      const height = active ? ACTIVE_HEIGHT : HEIGHT;
      const position = [relativePosition.x, height, relativePosition.y];
      const positionFixed = [relativePositionFixed.x, 0, relativePositionFixed.y];

      return {
        ...item,
        key: id,
        id,
        active,
        arrived,
        distance,
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

    this.currentCameraUpdate = 0;
    this.state = {
      isInitialized: false,
      currentVerticalAngle: 0,
      currentHorizontalAngleDelta: 0,
      markers,
      selectedMarker
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const {
      arSceneNavigator: {
        viroAppProps: { userLocation, activeMarker },
      },
      bearing,
      sceneNavigator,
    } = props;

    const { markers, selectedMarker: currentSelectedMarker } = state;

    const newMarkers = markers.map((marker) => {
      const {
        contentObject: { location: contentLocation },
      } = marker;

      const id = MapItemUtils.getIdFromMapItem(marker);
      const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;
      const arrived = LocationUtils.hasArrivedAtDestination(userLocation, contentLocation);

      const distance = LocationUtils.getTravelDistance(userLocation.coords, contentLocation);
      const relativePosition = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing, PIN_MAX_DISTANCE);
      const relativePositionFixed = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing);

      const height = active ? ACTIVE_HEIGHT : HEIGHT;
      const position = [relativePosition.x, height, relativePosition.y];
      const positionFixed = [relativePositionFixed.x, 0, relativePositionFixed.y];

      return {
        ...marker,
        active,
        arrived,
        distance,
        position,
        positionFixed,
      };
    });

    const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
    const selectedMarker = markers.find((marker) => {
      const markerId = MapItemUtils.getIdFromMapItem(marker);
      return markerId === selectedMarkerId;
    });

    if (currentSelectedMarker && selectedMarker.id !== currentSelectedMarker.id) {
      sceneNavigator.resetARSession(true, true);
    }

    return { markers: newMarkers, selectedMarker };
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
    if (this.currentCameraUpdate++ <= CAMERA_UPDATE_LIMIT) {
      return;
    }
    this.currentCameraUpdate = 0;

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

      if (MathUtils.exceedsThreshold(currentHorizontalAngleDelta, angleDelta, ANGLE_THRESHOLD) || MathUtils.exceedsThreshold(currentVerticalAngle, verticalAngle, ANGLE_THRESHOLD)) {
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

const mapState = (state: RootState) => {
  const { geolocation: { bearing } } = state;
  return { bearing };
}

const mapDispatch = (dispatch: Dispatch) => ({
  dispatchCameraUpdateAngles: (cameraTransform: Object) => dispatch(updateCameraAngles(cameraTransform)),
});

export default connect(
  mapState,
  mapDispatch,
)(MarkerScene);
