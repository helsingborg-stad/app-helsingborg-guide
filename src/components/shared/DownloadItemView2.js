/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { Platform, View, Text, StyleSheet, ProgressBarAndroid, TouchableOpacity, Dimensions, ProgressViewIOS } from "react-native";
import ViewContainer from "./view_container";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LangService } from "../../services/langService";

const FULL_WIDTH = Dimensions.get("window").width;
export default class DownloadItemView2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isCompleted = this.props.total <= this.props.currentPos && this.props.total > 0;
    let item;
    if (this.props.total == 0) item = null;
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
          <ProgressViewIOS progressTintColor="#D35098" style={styles.progressView} progress={this.props.progress} />
        ) : (
          <ProgressBarAndroid color="#D35098" styleAttr="Horizontal" indeterminate={false} progress={this.props.progress} />
        );
    }

    return <View style={styles.wrapper}>{item}</View>;
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxHeight: 30,
    justifyContent: "flex-start",
    // backgroundColor:'red'
  },
});
