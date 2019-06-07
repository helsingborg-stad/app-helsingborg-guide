// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Platform } from "react-native";
import { ViroARSceneNavigator, ViroUtils } from "react-viro";
import CameraService from "../../../services/cameraService";
import LangService from "../../../services/langService";
import LocationService from "../../../services/locationService";
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
  bearing: number,
};

const isWithinRange = (value, min, max) => value > min && value < max;

export default class ARView extends Component<Props, State> {
  state = { arSupported: false, arState: ARState.CHECKING, angle: 0, cameraVerticalRotation: 0, bearing: 0 };

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

    LocationService
      .getInstance()
      .getCompassBearing()
      .then(bearing => this.setState({ bearing }));
  }

  checkSupport() {
    const unsupportedCallback = reason => this.setState({ arSupported: false, arState: ARState[reason] });
    const supportedCallback = () => this.setState({ arSupported: true, arState: ARState.SUPPORTED });
    isARSupportedOnDevice(unsupportedCallback, supportedCallback);
  }

  getCurrentHintText = (): ?string => {
    const { angle, cameraVerticalRotation } = this.state;

    // Horizontal rotation
    if (angle > 20) {
      if (angle < 140) {
        return LangService.strings.AR_HINT_LOOK_LEFT;
      }
      if (angle < 220) {
        return LangService.strings.AR_HINT_TURN_AROUND;
      }
      if (angle < 340) {
        return LangService.strings.AR_HINT_LOOK_RIGHT;
      }
    }

    // Vertical rotation
    if (isWithinRange(cameraVerticalRotation, 90, 160) || isWithinRange(cameraVerticalRotation, 25, 90)) {
      return LangService.strings.AR_HINT_LOOK_UP;
    }
    if (isWithinRange(cameraVerticalRotation, 190, 270) || isWithinRange(cameraVerticalRotation, 270, 340)) {
      return LangService.strings.AR_HINT_LOOK_DOWN;
    }

    return null;
  };

  render() {
    const {
      state: { arSupported, arState, angle, bearing },
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
            bearing,
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

