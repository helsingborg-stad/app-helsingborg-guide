import React from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ProgressBarAndroid,
  ProgressViewIOS,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconTextTouchable from "../shared/IconTextTouchable";
import LangService from "../../services/langService";
import { StyleSheetUtils } from "../../utils/";
import { Colors, TextStyles } from "../../styles/";

const SCREEN_WIDTH = Dimensions.get("window").width;

const platformSpecificPadding = Platform.OS === "ios" ? 11 : 16;
const platformSpecificProgressPadding = Platform.OS === "ios" ? 10 : 0;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16
  },
  cancelResumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  progressView: {
    position: "absolute",
    width: SCREEN_WIDTH,
    bottom: 0
  },
  buttonText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.purple
    }
  ])
});

const DownloadItemView2 = ({
  total,
  currentPos,
  isCanceled,
  progress,
  pauseCallback,
  resumeCallback,
  cancelCallback,
  progressBarWidth
}) => {
  const modifiedStyle = StyleSheetUtils.flatten([
    styles.progressView,
    {
      width: progressBarWidth
    }
  ]);

  const isCompleted = total <= currentPos && total > 0;
  let item;
  if (total === 0) {
    item = null;
  } else if (isCanceled) {
    item = (
      <View style={{ paddingTop: platformSpecificPadding }}>
        <View style={styles.cancelResumeContainer}>
          <TouchableOpacity onPress={() => cancelCallback()}>
            <Text style={styles.buttonText}>
              {LangService.strings.DOWNLOADING_CANCEL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => resumeCallback()}>
            <Text style={styles.buttonText}>
              {LangService.strings.DOWNLOADING_RESUME}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: platformSpecificProgressPadding }}>
          {Platform.OS === "ios" ? (
            <ProgressViewIOS
              progressTintColor="#D35098"
              style={progressBarWidth ? modifiedStyle : styles.progressView}
              progress={progress}
            />
          ) : (
            <ProgressBarAndroid
              color="#D35098"
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress}
            />
          )}
        </View>
      </View>
    );
  } else if (isCompleted) {
    const textStyle = { fontSize: 16, color: "green", paddingHorizontal: 10 };
    item = (
      <View style={styles.container}>
        <Icon name="check" size={16} color="green" />
        <Text style={textStyle}> {LangService.strings.DOWNLOADED} </Text>
      </View>
    );
  } else {
    const percentage = parseInt((currentPos / total) * 100);
    const outerWrapperStyle = { paddingTop: 12 };
    const innerWrapeprStyle = { paddingLeft: 16 };
    const iosProgressStyle = { paddingTop: 5 };
    const androidProgressStyle = { paddingTop: 0 };

    item = (
      <View style={outerWrapperStyle}>
        <View style={innerWrapeprStyle}>
          <IconTextTouchable
            text={`${LangService.strings.DOWNLOADING} ${percentage}% ${
              LangService.strings.DOWNLOADING_PAUSE
            }`}
            iconName="get-app"
            onPress={() => pauseCallback()}
          />
        </View>

        {Platform.OS === "ios" ? (
          <View style={iosProgressStyle}>
            <ProgressViewIOS
              progressTintColor="#D35098"
              style={progressBarWidth ? modifiedStyle : styles.progressView}
              progress={progress}
            />
          </View>
        ) : (
          <View style={androidProgressStyle}>
            <ProgressBarAndroid
              color="#D35098"
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress}
            />
          </View>
        )}
      </View>
    );
  }

  return item;
};

DownloadItemView2.propTypes = {
  total: PropTypes.number.isRequired,
  currentPos: PropTypes.number.isRequired,
  isCanceled: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  pauseCallback: PropTypes.func.isRequired,
  resumeCallback: PropTypes.func.isRequired,
  cancelCallback: PropTypes.func.isRequired
};

export default DownloadItemView2;
