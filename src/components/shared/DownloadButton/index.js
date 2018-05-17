// @flow
import React, { Component } from "react";
import {
  Platform,
  ProgressViewIOS,
  ProgressBarAndroid,
  Text,
  TouchableOpacity,
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
  cancelDownloadGuide,
  resumeDownloadGuide,
} from "../../../actions/downloadGuidesActions";

type Props = {
  style?: any,
  progress: number,
  currentGuide: ?Guide,
  status: DownloadStatus,
  startDownload(guide: Guide): void,
  pauseDownload(guide: Guide): void,
  cancelDownload(guide: Guide): void,
  resumeDownload(guide: Guide): void,
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

  renderPaused = () => {
    const { currentGuide } = this.props;
    return (
      <View style={styles.cancelResumeContainer}>
        <TouchableOpacity
          onPress={() => {
            if (currentGuide) { this.props.cancelDownload(currentGuide); }
          }}
        >
          <Text style={styles.buttonText}>{LangService.strings.DOWNLOADING_CANCEL}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentGuide) { this.props.resumeDownload(currentGuide); }
          }}
        >
          <Text style={styles.buttonText}>{LangService.strings.DOWNLOADING_RESUME}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderDefault = () => {
    const { progress, currentGuide, status } = this.props;
    const percentage = parseInt(progress * 100);
    const buttonText = status === "stopped" ? LangService.strings.DOWNLOAD :
      `${LangService.strings.DOWNLOADING} ${percentage}% ${LangService.strings.DOWNLOADING_PAUSE}`;
    return (<View
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
        }}
      />
    </View>
    );
  }


  render() {
    const { style, status, progress } = this.props;
    return (
      <View style={[styles.container, style]} >
        {status === "paused" ? this.renderPaused() : this.renderDefault()}
        {renderProgressbar(progress)}
      </View >
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;

  let progress = 0;
  let status: DownloadStatus = "stopped";
  if (currentGuide) {
    const { downloads } = state.downloadedGuides;
    const downloadedGuide = downloads[currentGuide.id];
    if (downloadedGuide) {
      ({ progress, status } = downloadedGuide);
    }
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
    cancelDownload: (guide: Guide) => dispatch(cancelDownloadGuide(guide)),
    resumeDownload: (guide: Guide) => dispatch(resumeDownloadGuide(guide)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
