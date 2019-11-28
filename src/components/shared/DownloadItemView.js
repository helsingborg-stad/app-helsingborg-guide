import React, { Component } from "react";
import {
  Platform,
  ProgressViewIOS,
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewContainer from "./view_container";
import RoundedThumbnail from "../shared/thumbnail_rounded";
import LangService from "../../services/langService";

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#c6c6c6"
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15
  },
  header: {
    height: 40,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 15
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold"
  },
  avatarContainer: {
    flex: 1
  },
  progressBarContainer: {
    flex: 4,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "stretch",
    justifyContent: "center"
  },
  progressTextContainer: { flex: 1 },
  progressText: { fontSize: 12, lineHeight: 14 },
  barContainer: {
    flex: 1
  },
  btnContainer: {
    flex: 1
  },
  touchContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

type Props = {
  progress: any,
  isPaused: any,
  title: title,
  onPressItem: any,
  thumbnail: any,
  onResumePress: any,
  onPausePress: any,
  onClearPress: any
};

export default class DownloadItemView extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.renderProgressBar = this.renderProgressBar.bind(this);
  }

  renderProgressBar(color) {
    if (Platform.OS === "ios") {
      return (
        <ProgressViewIOS
          progressTintColor={color}
          style={styles.progressView}
          progress={this.props.progress}
        />
      );
    }
    return (
      <ProgressBarAndroid
        color={color}
        indeterminate={false}
        styleAttr="Horizontal"
        progress={this.props.progress}
      />
    );
  }

  render() {
    const isCompleted = this.props.progress >= 1;
    const color = isCompleted ? "green" : "#D35098";

    const resumeIcon = <Icon name="reload" color="#ED57AC" size={25} />;
    const pauseIcon = <Icon name="stop" color="#ED57AC" size={25} />;
    let icon = this.props.isPaused ? resumeIcon : pauseIcon;
    icon = isCompleted ? null : icon;
    const percentage = parseInt(this.props.progress * 100);
    return (
      <ViewContainer style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{this.props.title}</Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={this.props.onPressItem}>
              <RoundedThumbnail imageSource={{ uri: this.props.thumbnail }} />
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {`${LangService.strings.DOWNLOADING} ${percentage}%`}{" "}
              </Text>
            </View>
            <View style={styles.barContainer}>
              {this.renderProgressBar(color)}
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.touchContainer}
              onPress={
                this.props.isPaused
                  ? this.props.onResumePress
                  : this.props.onPausePress
              }
            >
              {icon}
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.touchContainer}
              onPress={this.props.onClearPress}
            >
              <Icon name="delete" size={25} color="#ED57AC" />
            </TouchableOpacity>
          </View>
        </View>
      </ViewContainer>
    );
  }
}
