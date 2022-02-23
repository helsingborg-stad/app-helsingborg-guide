import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Linking,
  Alert,
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


const ScanScreen = (props) => {
  const { navigation } = props;
  const scannerRef = useRef();

  useEffect(() => {
    if (navigation.isFocused()) {
      scannerRef?.current?.reactivate();
    }
  }, [navigation.isFocused()]);


  const onRead = (e) => {
    const { data } = e;
      if (data) {
        Alert.alert(
          LangService.strings.OPEN_LINK,
          data,
          [
            {
              text: LangService.strings.CANCEL,
              style: "default",
              onPress: () =>  setTimeout(() => scannerRef?.current?.reactivate(), 300)
            },
            {
              text: LangService.strings.OPEN,
              style: "default",
              onPress: () => {
                Linking.openURL(data)
                  .catch(err => {
                  Alert.alert(
                    "Error opening URL",
                    err?.message,
                    [
                      {
                        text: LangService.strings.CLOSE,
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                    ]
                  );
                })
                  .finally(() => {
                    scannerRef?.current?.reactivate()
                  })
              }
            },
          ]
        )
      }
  };

  return (
    <View style={styles.container}>
      <QrScanner
        _ref={(node) => { scannerRef.current = node }}
        onRead={(e) => navigation.isFocused() && onRead(e)}
        initialTorchEnabled={false}
        enableTorchButton={true}
        enableFlipButton={true}
        backgroundColor={Colors.white}
        iconColor={Colors.themeSecondary}
      />
    </View>
  );
};

ScanScreen["navigationOptions"] = () => (
  {
    title: LangService.strings.SCAN,
    headerLeft: () => null,
  });

export default ScanScreen;


