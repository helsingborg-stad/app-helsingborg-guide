import React from "react";
import { Platform, View, Text, StyleSheet, ProgressBarAndroid, ProgressViewIOS } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LangService from "../../services/langService";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxHeight: 30,
    justifyContent: "flex-start",
  },
});

export default ({ total, currentPos, progress }) => {
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
        Platform.OS === "ios" ? (
          <ProgressViewIOS progressTintColor="#D35098" style={styles.progressView} progress={progress} />
        ) : (
          <ProgressBarAndroid color="#D35098" styleAttr="Horizontal" indeterminate={false} progress={progress} />
        );
    }

    return <View style={styles.wrapper}>{item}</View>;
  }
};
