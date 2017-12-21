import React from "react";
import { Platform, View, Text, StyleSheet, ProgressBarAndroid, ProgressViewIOS, Dimensions } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LangService from "../../services/langService";

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: "stretch",
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
        <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 15, alignItems: "center" }}>
          <Icon name="check" size={15} color="green" />
          <Text style={{ fontSize: 14, color: "green", paddingHorizontal: 10 }}>{LangService.strings.DOWNLOADED}</Text>
        </View>
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

    return <View style={styles.wrapper}>{item}</View>;
  }
};

DownloadItemView2.propTypes = {
  total: PropTypes.number.isRequired,
  currentPos: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
};

export default DownloadItemView2;
