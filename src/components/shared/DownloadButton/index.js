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
import {
  startDownloadGuide,
  pauseDownloadGuide,
} from "../../../actions/downloadGuidesActions";

type Props = {
  style?: any,
  progress: number,
  currentGuide: ?Guide,
  status: DownloadStatus,
  startDownload(guide: Guide): void,
  pauseDownload(guide: Guide): void,
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

  onCancelDownload = () => {
    console.log("CANCEL dowload");
    // TODO dispatch action
  };

  onResumeDownload = () => {
    console.log("RESUME download");
    // TODO dispatch action
  };

  render() {
    const { style, progress, currentGuide, status } = this.props;
    const percentage = parseInt(progress * 100);
    const buttonText = status === "stopped" ? LangService.strings.DOWNLOAD :
      `${LangService.strings.DOWNLOADING} ${percentage}% ${LangService.strings.DOWNLOADING_PAUSE}`;
    return (
      <View style={[styles.container, style]} >
        <View
          style={styles.textContainer}
        >
          <IconTextTouchable
            text={buttonText}
            iconName="get-app"
            onPress={() => {
              if (currentGuide) {
                if (status === "stopped") {
                  this.props.startDownload(currentGuide);
                } else if (status === "pending") {
                  this.props.pauseDownload(currentGuide);
                }
              }
            }
            }
          />
        </View>
        {renderProgressbar(progress)}
      </View >
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;

  let progress = 0;
  let status: DownloadStatus = "pending";
  if (currentGuide) {
    const { downloads } = state.downloadedGuides;
    const downloadedGuide = downloads[currentGuide.id];
    ({ progress, status } = downloadedGuide);
  }
  return {
    currentGuide,
    progress,
    status,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    startDownload: (guide: Guide) => dispatch(startDownloadGuide(guide)),
    pauseDownload: (guide: Guide) => dispatch(pauseDownloadGuide(guide)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
