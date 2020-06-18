import React, { Component } from "react";
import {
  Platform,
  ProgressViewIOS,
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewContainer from "@shared-components/view_container";
import RoundedThumbnail from "@shared-components/thumbnail_rounded";
import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray7,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  header: {
    height: 40,
    backgroundColor: Colors.offWhite1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 15,
  },
  headerText: {
    ...TextStyles.bold,
    fontSize: 12,
  },
  avatarContainer: {
    flex: 1,
  },
  progressBarContainer: {
    flex: 4,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "stretch",
    justifyContent: "center",
  },
  progressTextContainer: { flex: 1 },
  progressText: { fontSize: 12, lineHeight: 14 },
  barContainer: {
    flex: 1,
  },
  btnContainer: {
    flex: 1,
  },
  touchContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

type Props = {
  progress: any,
  isPaused: any,
  title: title,
  onPressItem: any,
  thumbnail: any,
  onResumePress: any,
  onPausePress: any,
  onClearPress: any,
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
    const color = isCompleted ? Colors.green : Colors.themeControl;

    const resumeIcon = (
      <Icon name="reload" color={Colors.themeControl} size={25} />
    );
    const pauseIcon = (
      <Icon name="stop" color={Colors.themeControl} size={25} />
    );
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
              <Icon name="delete" size={25} color={Colors.themeControl} />
            </TouchableOpacity>
          </View>
        </View>
      </ViewContainer>
    );
  }
}
