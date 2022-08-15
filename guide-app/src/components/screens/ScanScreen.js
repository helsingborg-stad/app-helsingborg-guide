import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Linking,
  Alert, StatusBar, TouchableWithoutFeedback
} from "react-native";
import InfoOverlayToggleView from "@shared-components/InfoOverlayToggleView";
import QrScanner from "@shared-components/QRScanner";
import LangService from "@services/langService";
import { Colors } from "@assets/styles";
import { UNIVERSAL_LINKING_URL } from "@data/endpoints";
import InformationOverlay from "@shared-components/InformationOverlay/InformationOverlay";
import QRScan from "@assets/images/qr_scan.svg";

type Props = {
  navigation: Object
};

const prefix = "guidehbg://";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

const ScanScreen = (props: Props) => {
  const { navigation } = props;
  const scannerRef = useRef();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  useEffect(() => {
    if (navigation.isFocused()) {
      navigation.setOptions({
        title: LangService.strings.SCAN,
        headerLeft: () => <View style={{ width: 36 }} />,
        headerRight: () => <InfoOverlayToggleView onToggleInfoOverlay={onToggleInfoOverlay} />
      });
      scannerRef?.current?.reactivate();
    }
  }, [navigation.isFocused()]);

  const onToggleInfoOverlay = () => {
    setShowInfoOverlay(!showInfoOverlay);
  };

  function renderInformationOverlay() {
    return (
      <TouchableWithoutFeedback onPress={onToggleInfoOverlay}>
        <InformationOverlay
          information={{
            title: LangService.strings.SCAN_QR_CODES,
            description: LangService.strings.SCAN_QR_CODES_DESCRIPTION,
            additional: LangService.strings.SCAN_QR_CODES_REMINDER,
            image: <QRScan width={80} />,
          }}
          onPressFunction={onToggleInfoOverlay}
        />
      </TouchableWithoutFeedback>
    );
  }


  const onRead = (e) => {
    const { data } = e;
    let parsed = data.replace(/\#.*$/, "");
    let url;

    // INTERNAL URL
    if (data?.split(":")[0] === "guidehbg") {
      url = parsed;
    }

    // UNIVERSAL URL
    else if (data?.includes(UNIVERSAL_LINKING_URL)) {
      let params = parsed?.split(UNIVERSAL_LINKING_URL + "/?page=")[1] || parsed?.split(UNIVERSAL_LINKING_URL + "?link=")[1];
      if (params) {
        url = prefix + "home/" + params;
      }
    }

    if (url) {
      Alert.alert(
        LangService.strings.OPEN_LINK,
        data,
        [
          {
            text: LangService.strings.CANCEL,
            style: "default",
            onPress: () => setTimeout(() => scannerRef?.current?.reactivate(), 300)
          },
          {
            text: LangService.strings.OPEN,
            style: "default",
            onPress: () => {
              Linking.openURL(url)
                .catch(err => {
                  Alert.alert(
                    LangService.strings.INVALID_URL,
                    err?.message,
                    [
                      {
                        text: LangService.strings.CLOSE,
                        onPress: () => setTimeout(() => scannerRef?.current?.reactivate(), 300),
                        style: "cancel"
                      }
                    ]
                  );
                })
                .finally(() => {
                  scannerRef?.current?.reactivate();
                });
            }
          }
        ]
      );
    } else {
      Alert.alert(
        LangService.strings.INVALID_URL,
        LangService.strings.INVALID_URL_MESSAGE,
        [
          {
            text: LangService.strings.CLOSE,
            onPress: () => setTimeout(() => scannerRef?.current?.reactivate(), 300),
            style: "cancel"
          }
        ]
      );
    }
  };

  console.log("showInfoOverlay", showInfoOverlay);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.themeSecondary} />
      <View style={styles.container}>
        <QrScanner
          _ref={(node) => {
            scannerRef.current = node;
          }}
          onRead={(e) => navigation.isFocused() && onRead(e)}
          initialTorchEnabled={false}
          enableTorchButton={true}
          enableFlipButton={true}
          backgroundColor={Colors.black}
          iconColor={Colors.themeExtra2}
          hideTop={true}
          hideBottom={true}
        />
        {showInfoOverlay
          ? renderInformationOverlay()
          : null}
      </View>
    </>
  );
};

export default ScanScreen;


