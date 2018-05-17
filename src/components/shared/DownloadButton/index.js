// @flow
import React, { Component } from "react";
import {
  Platform,
  ProgressViewIOS,
  ProgressBarAndroid,
  View,
} from "react-native";
import { connect } from "react-redux";
import LangService from "../../../services/langService";
import IconTextTouchable from "../IconTextTouchable";
import { Colors } from "../../../styles";
import styles from "./styles";

type Props = {
  style?: any,
  progress: number,
}

function renderProgressbar(progress: number) {
  return (
    <View>
      {Platform.OS === "ios" ? (
        <ProgressViewIOS
          progressTintColor={Colors.lightPink}
          style={styles.progressView}
          progress={progress}
        />)
        : (
          <ProgressBarAndroid
            color={Colors.lightPink}
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress}
          />)}
    </View >
  );
}

class DownloadButton extends Component<Props> {
  static defaultProps = {
    style: {},
  };

  onStartDownload = () => {
    console.log("START downlaod");
    // TODO dispatch action
  };

  onCancelDownload = () => {
    console.log("CANCEL dowload");
    // TODO dispatch action
  };

  onPauseDownload = () => {
    console.log("PAUSE download");
    // TODO dispatch action
  };

  onResumeDownload = () => {
    console.log("RESUME download");
    // TODO dispatch action
  };

  render() {
    const { style, progress } = this.props;
    return (
      <View style={[styles.container, style]}>
        <View
          style={styles.textContainer}
        >
          <IconTextTouchable
            text={LangService.strings.DOWNLOAD}
            iconName="get-app"
            onPress={this.onStartDownload}
          />
        </View>
        {renderProgressbar(progress)}
      </View>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
