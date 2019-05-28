// @flow
import React, { Component } from "react";
import { ViroARScene, ViroText, ViroConstants, ViroNode, ViroImage } from "react-viro";
import { LocationUtils, MapItemUtils } from "../../../utils";
import LocationService from "../../../services/locationService";
import Marker from "./Marker";

const ARRIVE_DISTANCE = 10;

type Props = {
  arSceneNavigator: any,
};
type State = {
  isInitialized: boolean,
  markers: Array<any>,
};

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

        return {
          ...item,
          relativePosition,
        };
      }),
    };
  }

  _onInitialized = (tracking) => {
    switch (tracking) {
      case ViroConstants.TRACKING_NORMAL:
        console.log("Tracking initialised");
        this.setState({ isInitialized: true });
        break;
      case ViroConstants.TRACKING_LIMITED:
        console.log("Tracking Limited");
        this.setState({ isInitialized: true });
        break;
      case ViroConstants.TRACKING_NONE:
      default:
        console.log("Tracking uninitialised");
        this.setState({ isInitialized: false });
        break;
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
      _onInitialized,
    } = this;

    return (
      <ViroARScene onTrackingUpdated={_onInitialized}>
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
