import React from "react";
import { Platform, View, Text, StyleSheet, ProgressBarAndroid, ProgressViewIOS, Dimensions } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LangService from "../../services/langService";

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressView: {
    position: "absolute",
    width: SCREEN_WIDTH,
    bottom: 0,
  },
});

const DownloadItemView2 = ({ total, currentPos, progress }) => {
  {
    const isCompleted = total <= currentPos && total > 0;
    let item;
    if (total === 0) item = null;
    else if (isCompleted) {
      item = (
        <View style={styles.container}>
          <Icon name="check" size={16} color="green" />
          <Text style={{ fontSize: 16, color: "green", paddingHorizontal: 10 }}>{LangService.strings.DOWNLOADED}</Text>
        </View >
      );
    } else {
      item =
        Platform.OS === "ios"
          ? (
            <ProgressViewIOS progressTintColor="#D35098" style={styles.progressView} progress={progress} />
          )
          : (
            <ProgressBarAndroid color="#D35098" styleAttr="Horizontal" indeterminate={false} progress={progress} />
          );
    }

    return item;
  }
};

DownloadItemView2.propTypes = {
  total: PropTypes.number.isRequired,
  currentPos: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
};

export default DownloadItemView2;
