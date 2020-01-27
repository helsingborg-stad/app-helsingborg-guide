// @flow

import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ViroARSceneNavigator } from "react-viro";
import CameraService from "@services/cameraService";
import LangService from "@services/langService";
import MarkerScene from "./MarkerScene";
import OffscreenMarkersView from "./OffscreenMarkersView";
import InstructionIllustration from "@shared-components/InstructionIllustration";
import { SettingsUtils, AnalyticsUtils } from "@utils";
import OffscreenHintView from "./OffscreenHintView";
import { SegmentControlHeight } from "@shared-components/SegmentControl/styles";
import styles from "./styles";

const arrivalPinImage = require("@assets/images/PinArrived_2D_grayscale.png");

const ARState = {
  CAMERA_DISABLED: "AR_CAMERA_DISABLED",
  CHECKING: "AR_CHECKING",
  TRANSIENT: "AR_TRANSIENT",
  SUPPORTED: "AR_SUPPORTED",
  UNKNOWN: "AR_UNKNOWN",
  UNSUPPORTED: "AR_UNSUPPORTED"
};

type Props = {
  items: Array<MapItem>,
  userLocation: ?GeolocationType,
  activeMarker: MapItem,
  onArMarkerPressed: ?(index: number) => void,
  arSupported: boolean,
  onCameraPermissionDenied: ?() => void
};

type State = {
  cameraPermission: ?boolean
};

export default class ARView extends Component<Props, State> {
  state = { cameraPermission: null };

  componentDidMount() {
    const { arSupported, onCameraPermissionDenied } = this.props;

    if (arSupported === true) {
      CameraService.getInstance()
        .checkCameraPermissions()
        .then(() => {
          AnalyticsUtils.logEvent("camera_permission_accepted");
          this.setState({ cameraPermission: true });
        })
        .catch(() => {
          AnalyticsUtils.logEvent("camera_permission_denied");
          this.setState({ cameraPermission: false });

          if (onCameraPermissionDenied) {
            onCameraPermissionDenied();
          }
        });
    } else {
      this.setState({ cameraPermission: false }); //eslint-disable-line react/no-did-mount-set-state
    }
  }

  render() {
    const {
      state: { cameraPermission },
      props: {
        items,
        userLocation,
        activeMarker,
        onArMarkerPressed,
        arSupported
      }
    } = this;

    if (cameraPermission !== null) {
      return (
        <View style={styles.container}>
          {cameraPermission && arSupported ? (
            <View style={styles.container}>
              <ViroARSceneNavigator
                initialScene={{ scene: MarkerScene }}
                viroAppProps={{
                  items,
                  userLocation,
                  activeMarker,
                  onArMarkerPressed
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
            <View
              style={[
                styles.unsupportedContainer,
                { paddingTop: SegmentControlHeight + 10 }
              ]}
            >
              <InstructionIllustration
                speechBubbleText={LangService.strings.AR_NOT_SUPPORTED_CALLOUT.toUpperCase()}
                instructionText={
                  arSupported && !cameraPermission
                    ? LangService.strings.MESSAGE_CAMERA_PERMISSION
                    : LangService.strings[ARState.UNSUPPORTED]
                }
                image={arrivalPinImage}
              />
              {arSupported && !cameraPermission && (
                <TouchableOpacity
                  style={styles.goToSettingsButton}
                  onPress={() => {
                    AnalyticsUtils.logEvent("tap_open_settings_from_ar");
                    SettingsUtils.openSettings();
                  }}
                >
                  <Text style={styles.goToSettingsButtonText}>
                    {LangService.strings.SETTINGS}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      );
    }

    return <View />;
  }
}
