import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { Colors } from "@assets/styles";


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
    alignContent: 'center',
    alignItems: "center",
  },

  bottomText: {
    color: Colors.white,
  },

});

const QRScanner = ({ onRead, initialTorchEnabled, enableTorchButton, enableFlipButton, reactivateOnScan }) => {

  const [enableTorch, setEnableTorch] = useState(!!(initialTorchEnabled))
  const [cameraMode, setCameraMode] = useState('back')

  useEffect(() => {
    return () => setEnableTorch(false);
  },[])

  return (
    <View style={styles.container}>
      <QRCodeScanner
        cameraStyle={styles.camera}
        cameraType={cameraMode}
        onRead={(e) => onRead(e)}
        flashMode={enableTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={
          <View style={styles.scannerTopContent}>
          </View>
        }
        bottomContent={
          <View style={styles.scannerBottomContent}>
            {enableTorchButton &&
            <TouchableOpacity
              onPress={() => setEnableTorch(!enableTorch)}
              style={styles.bottomItem}>
              <Text style={styles.bottomText}>Torch here</Text>
            </TouchableOpacity>}
            {enableFlipButton &&
              <TouchableOpacity
                onPress={() => setCameraMode(cameraMode === "back" ? "front" : "back")}
                style={styles.bottomItem}>
                <Text style={styles.bottomText}>Flip here</Text>
              </TouchableOpacity>}
          </View>
        }
        reactivate={!!(reactivateOnScan)}
      />
    </View>
  );
};

export default QRScanner;
