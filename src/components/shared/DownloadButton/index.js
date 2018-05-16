// @flow

import React from "react";
import {
  Text,
  View,
} from "react-native";
import LangService from "../../../services/langService";
import IconTextTouchable from "../IconTextTouchable";
import styles from "./styles";

type Props = {
  style?: any,
  status: "idle" | "pending" | "paused" | "done",
  onStartDownload(): void,
}

const DownloadButton = (props: Props) => {
  switch (props.status) {
    case "done":
      return (
        <View style={props.style}>
          <Text style={{ fontSize: 16, color: "green", paddingHorizontal: 10 }}>{LangService.strings.DOWNLOADED}</Text>
        </View>
      );
    case "paused":
    case "pending":
    case "idle":
    default:
      return (
        <View style={[styles.container, props.style]}>
          <IconTextTouchable
            text={LangService.strings.DOWNLOAD}
            iconName="get-app"
            onPress={props.onStartDownload}
          />
        </View>
      );
  }
};

export default DownloadButton;
