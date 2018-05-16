// @flow
import React from "react";
import {
  Platform,
  ProgressViewIOS,
  ProgressBarAndroid,
  View,
} from "react-native";
import LangService from "../../../services/langService";
import IconTextTouchable from "../IconTextTouchable";
import { Colors } from "../../../styles";
import styles from "./styles";

type Props = {
  style?: any,
  onStartDownload(): void,
  progress: number,
}

function renderProgressbar(progress: number) {
  return (
    <View>
      {Platform.OS === "ios"
        ? (
          <ProgressViewIOS progressTintColor={Colors.lightPink} style={styles.progressView} progress={progress} />
        )
        : (
          <ProgressBarAndroid color={Colors.lightPink} styleAttr="Horizontal" indeterminate={false} progress={progress} />
        )}
    </View >
  );
}

const DownloadButton = (props: Props) => (
  <View style={[styles.container, props.style]}>
    <View
      style={styles.textContainer}
    >
      <IconTextTouchable
        text={LangService.strings.DOWNLOAD}
        iconName="get-app"
        onPress={props.onStartDownload}
      />
    </View>
    {renderProgressbar(props.progress)}
  </View>
);

DownloadButton.defaultProps = {
  style: {},
};

export default DownloadButton;
