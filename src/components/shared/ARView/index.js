// @flow

import React, { Component } from "react";
import { View, Text } from "react-native";
import { ViroARSceneNavigator, ViroUtils } from "react-viro";
import CameraService from "../../../services/cameraService";
import LangService from "../../../services/langService";
import MarkerScene from "./MarkerScene";
import OffscreenMarkersView from "./OffscreenMarkersView";
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
  offScreenMarkerViewStyle: any,
};

type State = {
  arSupported: boolean,
  arState: string,
  angle: number,
  cameraVerticalRotation: number,
};

export default class ARView extends Component<Props, State> {
  state = { arSupported: false, arState: ARState.CHECKING, angle: 0, cameraVerticalRotation: 0 };

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

  getCurrentHintText = (): ?string => {
    const { angle, cameraVerticalRotation } = this.state;

    const isWithinRange = (value, min, max) => value > min && value < max;

    // Horizontal rotation
    if (angle > 20) {
      if (angle < 140) {
        return "Kolla åt vänster";
      }
      if (angle < 220) {
        return "Vänd dig om";
      }
      if (angle < 340) {
        return "Kolla åt höger";
      }
    }

    // Vertical rotation
    if (isWithinRange(cameraVerticalRotation, 90, 160) || isWithinRange(cameraVerticalRotation, 25, 90)) {
      return "Kolla upp";
    }
    if (isWithinRange(cameraVerticalRotation, 190, 270) || isWithinRange(cameraVerticalRotation, 270, 340)) {
      return "Kolla ner";
    }

    return null;
  };

  render() {
    const {
      state: { arSupported, arState, angle },
      props: { items, userLocation, activeMarker, onArMarkerPressed, offScreenMarkerViewStyle },
    } = this;
    const hint = this.getCurrentHintText();

    return arSupported ? (
      <View style={styles.container}>
        <ViroARSceneNavigator
          initialScene={{ scene: MarkerScene }}
          viroAppProps={{
            items,
            userLocation,
            activeMarker,
            onArMarkerPressed,
            onDirectionAngleChange: ({ angleDifference: newAngle, cameraVerticalRotation: newCameraVerticalRotation }) => this.setState({
              angle: newAngle,
              cameraVerticalRotation: newCameraVerticalRotation,
            }),
          }}
          autofocus
          apiKey="B896B483-78EB-42A3-926B-581DD5151EE8"
          worldAlignment="GravityAndHeading"
        />
        <OffscreenMarkersView
          style={offScreenMarkerViewStyle}
          items={items}
          userLocation={userLocation}
          activeMarker={activeMarker}
          angle={angle}
          pointerEvents="none"
        />
        {hint && (
          <View style={{ ...styles.hintContainer, top: offScreenMarkerViewStyle.top + 10 }}>
            <View style={styles.hintOverlay}>
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          </View>
        )}
      </View>
    ) : (
      <View>
        <Text>{LangService.strings[arState]}</Text>
      </View>
    );
  }
}
