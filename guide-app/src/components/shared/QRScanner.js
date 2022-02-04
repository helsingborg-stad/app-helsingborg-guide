import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height: '100%',
  },
  camera: {
    height: '100%',
  }
});

const QRScanner = ({ onRead, topContent, bottomContent }) => {

  const [enableTorch, setEnableTorch] = useState(false);

  return (
    <View style={styles.container}>
      <QRCodeScanner
        cameraStyle={styles.camera}
        onRead={(e) => onRead(e)}
        flashMode={enableTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={topContent || <View></View>}
        bottomContent={bottomContent || <View></View>}
      />
    </View>
  );
};

export default QRScanner;
