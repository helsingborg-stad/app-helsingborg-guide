// @flow
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { ProgressView as ProgressViewIOS } from "@react-native-community/progress-view";
import { ProgressBar as ProgressBarAndroid } from "@react-native-community/progress-bar-android";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LangService from "@services/langService";
import IconTextTouchable from "@shared-components/IconTextTouchable";
import { Colors } from "@assets/styles";
import styles from "./styles";
import {
  startDownloadGuide,
  pauseDownloadGuide,
  cancelDownloadGuide,
  resumeDownloadGuide,
} from "@actions/downloadGuidesActions";
import { trackEvent } from "@utils/MatomoUtils";

type Props = {
  style?: any,
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

const DownloadButton = (props: Props) => {
  const { style } = props;
  const { currentGuide } = useSelector((s) => s.uiState);
  const { offlineGuides } = useSelector((s) => s.downloadedGuides);
  const dispatch = useDispatch();

  let progress = 0;
  let status: DownloadStatus = "stopped";
  if (currentGuide) {
    const offlineGuide = offlineGuides[currentGuide.id];
    if (offlineGuide) {
      ({ progress, status } = offlineGuide);
    }
  }

  const renderPaused = () => {
    return (
      <View style={styles.cancelResumeContainer}>
        <TouchableOpacity
          onPress={() => {
            if (currentGuide) {
              dispatch(cancelDownloadGuide(currentGuide));
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
              dispatch(resumeDownloadGuide(currentGuide));
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

  const renderDefault = () => {
    const percentage = Math.min(parseInt(progress * 100), 100);
    const buttonText =
      status === "stopped"
        ? LangService.strings.DOWNLOAD
        : `${LangService.strings.DOWNLOADING} ${percentage}% ${LangService.strings.DOWNLOADING_PAUSE}`;
    return (
      <View style={styles.textContainer}>
        <IconTextTouchable
          text={buttonText}
          iconName="get-app"
          onPress={() => {
            if (currentGuide) {
              if (status === "stopped") {
                dispatch(startDownloadGuide(currentGuide));
                trackEvent("download", "download_guide", currentGuide.slug);
              } else if (status === "pending") {
                dispatch(pauseDownloadGuide(currentGuide));
              }
            }
          }}
        />
      </View>
    );
  };

  const renderDone = () => (
    <View style={styles.doneContainer}>
      <Icon name="check" size={16} color="green" />
      <Text style={styles.doneText}>{LangService.strings.DOWNLOADED}</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {status === "paused" ? renderPaused() : null}
      {status === "pending" || status === "stopped" ? renderDefault() : null}
      {status === "done" ? renderDone() : null}
      {status !== "done" ? renderProgressbar(progress) : null}
    </View>
  );
};

export default DownloadButton;
