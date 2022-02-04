import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import QrScanner from "@shared-components/QRScanner";
import LangService from "@services/langService";
import { Colors } from "@assets/styles";


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

});



const ScanScreen = () => {


  const onRead = (e) => {
    console.log("render state scanner", e )
  }

    return (
      <View style={styles.container}>
        <QrScanner
          onRead={(e) => onRead(e)}
          initialTorchEnabled={false}
          enableTorchButton={true}
          reactivateOnScan={false}
          enableFlipButton={true}
        />
      </View>
    );
}

ScanScreen["navigationOptions"] = () => (
  {
    title: LangService.strings.SCAN,
    headerLeft: () => null,
  });

export default ScanScreen;


