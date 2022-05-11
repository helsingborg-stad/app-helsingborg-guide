import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import Icon from "react-native-vector-icons/Ionicons";

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

  cameraTall: {
    flex: 14,
    height: "100%",
    margin: 0,
    padding: 0,
  },

  scannerTopContent: {
    width: "100%",
    padding: 0,
    margin: 0,
    flex: 1,
  },

  scannerBottomContent: {
    width: "100%",
    padding: 0,
    margin: 0,
    flex: 1,
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

  torch: {
    position: "absolute",
    bottom: 40,
    width: '100%',
    alignItems: "center",
  },

});

const QRScanner = ({ _ref, onRead, initialTorchEnabled, enableTorchButton, backgroundColor, iconColor, hideTop, hideBottom}) => {

  const [enableTorch, setEnableTorch] = useState(!!(initialTorchEnabled))

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
        cameraStyle={(hideTop || hideBottom) ? styles.cameraTall : styles.camera}
        cameraType={"back"}
        onRead={(e) => {
          onRead(e);
        }}
        flashMode={enableTorch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={
          <View style={[styles.scannerTopContent,  {...(backgroundColor && {backgroundColor: backgroundColor})}]}>
          </View>
        }
        {...(hideTop && { topViewStyle: { display: "none" } })}
        {...(hideBottom && { bottomViewStyle: { display: "none" } })}
        bottomContent={
          <View style={[styles.scannerBottomContent, {...(backgroundColor && {backgroundColor: backgroundColor})} ]}>
            {enableTorchButton &&
            <TouchableOpacity
              onPress={() => setEnableTorch(!enableTorch)}
              style={styles.bottomItem}>
            <Icon name={"flash"} size={30} color={iconColor} />
            </TouchableOpacity>}
          </View>
        }
      />
      <TouchableOpacity
        onPress={() => setEnableTorch(!enableTorch)}
        style={styles.torch}
      >
        <Icon name={"flash"} size={30} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default QRScanner;
