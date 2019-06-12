// @flow

import React, { Component } from "react";
import { View, Text } from "react-native";
import { ViroARSceneNavigator, ViroUtils } from "react-viro";
import CameraService from "../../../services/cameraService";
import LangService from "../../../services/langService";
import MarkerScene from "./MarkerScene";
import OffscreenMarkersView from "./OffscreenMarkersView";
import OffscreenHintView from "./OffscreenHintView";
import styles from "./styles";

const { isARSupportedOnDevice } = ViroUtils;

const ARState = {
  CAMERA_DISABLED: "AR_CAMERA_DISABLED",
  CHECKING: "AR_CHECKING",
  TRANSIENT: "AR_TRANSIENT",
  SUPPORTED: "AR_SUPPORTED",
  UNKNOWN: "AR_UNKNOWN",
  UNSUPPORTED: "AR_UNSUPPORTED",
};

type Props = {
  items: Array<MapItem>,
  userLocation: ?GeolocationType,
  activeMarker: MapItem,
  onArMarkerPressed: ?(index: number) => void,
};

type State = {
  arSupported: boolean,
  arState: string,
};

export default class ARView extends Component<Props, State> {
  state = { arSupported: false, arState: ARState.CHECKING };

  componentDidMount() {
    CameraService.getInstance()
      .checkCameraPermissions()
      .then(
        () => {
          this.checkSupport();
        }, // permitted
        () => {
          this.setState({ arSupported: false, arState: ARState.CAMERA_DISABLED });
        }, // not permitted
      );
  }

  checkSupport() {
    const unsupportedCallback = reason => this.setState({ arSupported: false, arState: ARState[reason] });
    const supportedCallback = () => this.setState({ arSupported: true, arState: ARState.SUPPORTED });
    isARSupportedOnDevice(unsupportedCallback, supportedCallback);
  }

  render() {
    const {
      state: { arSupported, arState },
      props: { items, userLocation, activeMarker, onArMarkerPressed },
    } = this;

    return arSupported ? (
      <View style={styles.container}>
        <ViroARSceneNavigator
          initialScene={{ scene: MarkerScene }}
          viroAppProps={{
            items,
            userLocation,
            activeMarker,
            onArMarkerPressed,
          }}
          autofocus
          apiKey="B896B483-78EB-42A3-926B-581DD5151EE8"
          worldAlignment="GravityAndHeading"
        />
        <OffscreenMarkersView
          items={items}
          userLocation={userLocation}
          activeMarker={activeMarker}
          pointerEvents="none"
        />
        <OffscreenHintView />
      </View>
    ) : (
      <View>
        <Text>{LangService.strings[arState]}</Text>
      </View>
    );
  }
}

