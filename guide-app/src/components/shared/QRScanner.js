import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { Colors } from "@assets/styles";
import Torch from "@shared-components/svg/torch";
import Flip from "@shared-components/svg/flip";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height: "100%",
    margin: 0,
    padding: 0,
  },
  camera: {
    flex: 8,
    height: "100%",
    margin: 0,
    padding: 0,
  },

  scannerTopContent: {
    width: "100%",
    padding: 0,
    margin: 0,
    flex: 1,
    backgroundColor: "black",
  },

  scannerBottomContent: {
    width: "100%",
    padding: 0,
    margin: 0,
    flex: 1,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
  },

  bottomItem: {
    flex: 1,
    minWidth: 30,
    minHeight: 30,
    padding: 15,
    alignContent: 'center',
    alignItems: "center",
  },

});

const QRScanner = ({ _ref, onRead, initialTorchEnabled, enableTorchButton, enableFlipButton, backgroundColor, iconColor }) => {

  const [enableTorch, setEnableTorch] = useState(!!(initialTorchEnabled))
  const [cameraMode, setCameraMode] = useState('back')

  useEffect(() => {
    return () => {
      setEnableTorch(false);
      _ref?.current?.reactivate();
    }
  },[])

  return (
    <View style={styles.container}>
      <QRCodeScanner
        {...(_ref && {ref:  _ref})}
        cameraStyle={styles.camera}
        cameraType={cameraMode}
        onRead={(e) => {
          onRead(e);
        }}
        flashMode={enableTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={
          <View style={[styles.scannerTopContent,  {...(backgroundColor && {backgroundColor: backgroundColor})}]}>
          </View>
        }
        bottomContent={
          <View style={[styles.scannerBottomContent, {...(backgroundColor && {backgroundColor: backgroundColor})} ]}>
            {enableTorchButton &&
            <TouchableOpacity
              onPress={() => setEnableTorch(!enableTorch)}
              style={styles.bottomItem}>
            <Torch color={iconColor} />
            </TouchableOpacity>}
            {enableFlipButton &&
              <TouchableOpacity
                onPress={() => setCameraMode(cameraMode === "back" ? "front" : "back")}
                style={styles.bottomItem}>
              <Flip color={iconColor} />
              </TouchableOpacity>}
          </View>
        }
      />
    </View>
  );
};

export default QRScanner;
