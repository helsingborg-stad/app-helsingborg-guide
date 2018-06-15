// @flow
import React, { Component } from "react";
import { FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import DownloadItemView from "../shared/DownloadItemView";
import LangService from "../../services/langService";
import { Colors } from "../../styles/";
import {
  cancelDownloadGuide,
  pauseDownloadGuide,
  resumeDownloadGuide,
} from "../../actions/downloadGuidesActions";
import { selectCurrentGuide } from "../../actions/uiStateActions";
import { AnalyticsUtils } from "../../utils";

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
});

type Props = {
  downloads: OfflineGuide[],
  cancelDownload(guide: Guide): void,
  pauseDownload(guide: Guide): void,
  resumeDownload(guide: Guide): void,
  selectGuide(guide: Guide): void,
  navigation: any,
};

class DownloadsScreen extends Component<Props> {
  static navigationOptions = () => {
    const title = LangService.strings.OFFLINE_CONTENT;
    return {
      title,
      headerRight: null,
    };
  };

  navigateToGuide = (offlineGuide: OfflineGuide): void => {
    const { guide } = offlineGuide;
    const { guideType } = guide;
    this.props.selectGuide(guide);

    if (guideType === "guide") {
      AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
      this.props.navigation.navigate("GuideDetailsScreen", { title: guide.name });
    } else if (guideType === "trail") {
      AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
      this.props.navigation.navigate("TrailScreen", { title: guide.name });
    }
  }

  renderItem = ({ item }) => (
    <DownloadItemView
      title={item.guide.name}
      thumbnail={item.guide.images.thumbnail}
      progress={item.progress}
      isPaused={item.status === "paused"}
      onPausePress={() => this.props.pauseDownload(item.guide)}
      onResumePress={() => this.props.resumeDownload(item.guide)}
      onClearPress={() => this.props.cancelDownload(item.guide)}
      onPressItem={() => this.navigateToGuide(item)}
    />
  )

  render() {
    return (
      <FlatList
        style={styles.mainContainer}
        keyExtractor={item => `${item.guide.id}`}
        data={this.props.downloads}
        renderItem={this.renderItem}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  const { offlineGuides } = state.downloadedGuides;
  return {
    downloads: Object.values(offlineGuides),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelDownload: (guide: Guide) => dispatch(cancelDownloadGuide(guide)),
    pauseDownload: (guide: Guide) => dispatch(pauseDownloadGuide(guide)),
    resumeDownload: (guide: Guide) => dispatch(resumeDownloadGuide(guide)),
    selectGuide: guide => dispatch(selectCurrentGuide(guide)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);
