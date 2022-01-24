// @flow
import React, { Component } from "react";
import {
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ProgressView as ProgressViewIOS } from "@react-native-community/progress-view";
import { ProgressBar as ProgressBarAndroid } from "@react-native-community/progress-bar-android";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LangService from "@services/langService";
import IconTextTouchable from "@shared-components/IconTextTouchable";
import { Colors } from "@assets/styles";
import styles from "./styles";
import {
  startDownloadGuide,
  pauseDownloadGuide,
  cancelDownloadGuide,
  resumeDownloadGuide
} from "@actions/downloadGuidesActions";
import AnalyticsUtils from "@utils/AnalyticsUtils";
import { trackEvent } from "@utils/MatomoUtils";

type Props = {
  style?: any,
  progress: number,
  currentGuide?: ?Guide,
  status: DownloadStatus,
  startDownload(guide: Guide): void,
  pauseDownload(guide: Guide): void,
  cancelDownload(guide: Guide): void,
  resumeDownload(guide: Guide): void
};

function renderProgressbar(progress: number) {
  return (
    <View>
      {Platform.OS === "ios" ? (
        <ProgressViewIOS
          style={styles.progressViewIOS}
          trackTintColor={Colors.transparent}
          progressTintColor={Colors.themeControl}
          progress={progress}
        />
      ) : (
        <ProgressBarAndroid
          color={Colors.themeControl}
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          style={styles.progressBarAndroid}
        />
      )}
    </View>
  );
}

export class DownloadButton extends Component<Props> {
  static defaultProps = {
    style: {}
  };

  renderPaused = () => {
    const { currentGuide } = this.props;
    return (
      <View style={styles.cancelResumeContainer}>
        <TouchableOpacity
          onPress={() => {
            if (currentGuide) {
              this.props.cancelDownload(currentGuide);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {LangService.strings.DOWNLOADING_CANCEL}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentGuide) {
              this.props.resumeDownload(currentGuide);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {LangService.strings.DOWNLOADING_RESUME}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderDefault = () => {
    const { progress, currentGuide, status } = this.props;
    const percentage = Math.min(parseInt(progress * 100), 100);
    const buttonText =
      status === "stopped"
        ? LangService.strings.DOWNLOAD
        : `${LangService.strings.DOWNLOADING} ${percentage}% ${
            LangService.strings.DOWNLOADING_PAUSE
          }`;
    return (
      <View style={styles.textContainer}>
        <IconTextTouchable
          text={buttonText}
          iconName="get-app"
          onPress={() => {
            if (currentGuide) {
              if (status === "stopped") {
                this.props.startDownload(currentGuide);
                trackEvent("download", "download_guide", currentGuide.slug, currentGuide.slug)
                AnalyticsUtils.logEvent("download_guide", {
                  name: currentGuide.slug
                });
              } else if (status === "pending") {
                this.props.pauseDownload(currentGuide);
              }
            }
          }}
        />
      </View>
    );
  };

  renderDone = () => (
    <View style={styles.doneContainer}>
      <Icon name="check" size={16} color="green" />
      <Text style={styles.doneText}>{LangService.strings.DOWNLOADED}</Text>
    </View>
  );

  render() {
    const { style, status, progress } = this.props;
    return (
      <View style={[styles.container, style]}>
        {status === "paused" ? this.renderPaused() : null}
        {status === "pending" || status === "stopped"
          ? this.renderDefault()
          : null}
        {status === "done" ? this.renderDone() : null}
        {status !== "done" ? renderProgressbar(progress) : null}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;

  let progress = 0;
  let status: DownloadStatus = "stopped";
  if (currentGuide) {
    const { offlineGuides } = state.downloadedGuides;
    const offlineGuide = offlineGuides[currentGuide.id];
    if (offlineGuide) {
      ({ progress, status } = offlineGuide);
    }
  }
  return {
    currentGuide,
    progress,
    status
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    startDownload: (guide: Guide) => dispatch(startDownloadGuide(guide)),
    pauseDownload: (guide: Guide) => dispatch(pauseDownloadGuide(guide)),
    cancelDownload: (guide: Guide) => dispatch(cancelDownloadGuide(guide)),
    resumeDownload: (guide: Guide) => dispatch(resumeDownloadGuide(guide))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadButton);
