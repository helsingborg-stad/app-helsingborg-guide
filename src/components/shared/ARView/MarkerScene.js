// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { ViroARScene, ViroText, ViroConstants, ViroNode } from "react-viro";
import { LocationUtils, MapItemUtils, MathUtils } from "../../../utils";
import AnimatedCharacter from "./AnimatedCharacter";
import DirectionLine from "./DirectionLine";
import Marker from "./Marker";
import LocationService from "../../../services/locationService";

import { updateCameraAngles, updateCameraPosition } from "../../../actions/arActions";

type Props = {
  arSceneNavigator: any,
  dispatchCameraUpdateAngles(Object): void,
  dispatchCameraUpdatePosition(Array<number>): void,
};
type State = {
  isInitialized: boolean,
  markers: Array<any>,
  currentVerticalAngle: number,
  currentHorizontalAngleDelta: number,
  currentCameraPosition: Array<number>,
  selectedMarker: ?any,
};

const ANGLE_THRESHOLD = 10;
const CAMERA_POSITION_THRESHOLD = 2;
const ACTIVE_HEIGHT = 1;
const HEIGHT = 0;

const exceedsThreshold = (a, b, c) => Math.abs(a - b) >= c;


class MarkerScene extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const {
      arSceneNavigator: {
        viroAppProps: { userLocation, activeMarker },
      },
    } = props;

    const { markers } = state;
    const activeMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);

    const newMarkers = markers.map((marker) => {
      const {
        contentObject: { location: contentLocation },
      } = marker;
      const arrived = LocationUtils.hasArrivedAtDestination(userLocation, contentLocation);
      const id = MapItemUtils.getIdFromMapItem(marker);
      const active = activeMarkerId === id;

      return {
        ...marker,
        active,
        arrived,
      };
    });

    const selectedMarker = markers.find(({ active }) => active);

    return { markers: newMarkers, selectedMarker };
  }

  state = {
    isInitialized: false,
    markers: [],
    selectedMarker: null,
    currentVerticalAngle: 0,
    currentHorizontalAngleDelta: 0,
    currentCameraPosition: [0, 0, 0],
  };

  componentDidMount() {
    const {
      arSceneNavigator: {
        viroAppProps: { items, userLocation, activeMarker, onArMarkerPressed },
      },
    } = this.props;

    const activeMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);

    LocationService.getInstance()
      .getCompassBearing()
      .then((bearing) => {
        const markers = items.map((item) => {
          const {
            contentObject: { location: contentLocation },
          } = item;
          const id = MapItemUtils.getIdFromMapItem(item);
          const active = activeMarkerId === id;

          const relativePosition = LocationUtils.getLocationRelativePosition(userLocation, contentLocation, bearing);

          const height = active ? ACTIVE_HEIGHT : HEIGHT;
          const position = [relativePosition.x, height, relativePosition.y];
          const arrived = LocationUtils.hasArrivedAtDestination(userLocation, contentLocation);

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

        const selectedMarker = markers.find(({ active }) => active);

        this.setState({ markers, selectedMarker });
      });
  }

  onInitialized = (tracking: ViroConstants) => {
    switch (tracking) {
      case ViroConstants.TRACKING_NORMAL:
        // fallthrough
      case ViroConstants.TRACKING_LIMITED:
        this.setState({ isInitialized: true });
        break;
      case ViroConstants.TRACKING_NONE:
      default:
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
        dispatchCameraUpdatePosition,
      },
      state: { markers, selectedMarker, currentVerticalAngle, currentHorizontalAngleDelta, currentCameraPosition },
    } = this;

    const activeMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
    const active = markers.find(({ id }) => id === activeMarkerId);

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

      if (exceedsThreshold(currentHorizontalAngleDelta, angleDelta, ANGLE_THRESHOLD) || exceedsThreshold(currentVerticalAngle, verticalAngle, ANGLE_THRESHOLD)) {
        this.setState({
          currentHorizontalAngleDelta: angleDelta,
          currentVerticalAngle: verticalAngle,
          currentCameraPosition: cameraPosition,
        });

        dispatchCameraUpdateAngles({ verticalAngle, angleDelta });
        dispatchCameraUpdatePosition(cameraPosition);
      } else { // No need to check if we're already updating the camera position above
        for (let i = 0, l = cameraPosition.length; i < l; ++i) { // eslint-disable-line no-plusplus
          if (exceedsThreshold(currentCameraPosition[i], cameraPosition[i], CAMERA_POSITION_THRESHOLD)) {
            this.setState({ currentCameraPosition: cameraPosition });
            dispatchCameraUpdatePosition(cameraPosition);
          }
        }
      }

      if (active.id !== selectedMarker.id) {
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
            { selectedMarker && <DirectionLine markerPosition={selectedMarker.position} /> }
            { /* selectedMarker && <AnimatedCharacter markerPosition={selectedMarker.position} /> */ }
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
  dispatchCameraUpdatePosition: (cameraPosition: Array<number>) => dispatch(updateCameraPosition(cameraPosition)),
});

export default connect(
  null,
  mapDispatch,
)(MarkerScene);
