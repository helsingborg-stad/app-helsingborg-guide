// @flow
import React, { Component } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import DownloadItemView from "@shared-components/DownloadItemView";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LangService from "@services/langService";
import { Colors } from "@assets/styles";
import {
  cancelDownloadGuide,
  pauseDownloadGuide,
  resumeDownloadGuide,
} from "@actions/downloadGuidesActions";
import { selectCurrentGuide, showBottomBar } from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
});

type Props = {
  downloads: OfflineGuide[],
  cancelDownload(guide: Guide): void,
  hideBottomBar(): void,
  pauseDownload(guide: Guide): void,
  resumeDownload(guide: Guide): void,
  selectGuide(guide: Guide): void,
  navigation: any,
};

class DownloadsScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.OFFLINE_CONTENT;
    return {
      headerLeft: () => <HeaderBackButton navigation={navigation} />,
      title,
      headerRight: () => <View style={{ width: 36 }} />,
    };
  };

  navigateToGuide = (offlineGuide: OfflineGuide): void => {
    const { guide } = offlineGuide;
    const { guideType } = guide;
    this.props.selectGuide(guide);

    if (guideType === "guide") {
      this.props.hideBottomBar();
      const slug = guide?.slug;
      const title = guide?.name;
      trackScreen("view_guide", slug || title);
      // AnalyticsUtils.logEvent("view_guide", { name: slug });
      this.props.navigation.navigate("GuideDetailsScreen", {
        title: title,
        bottomBarOnUnmount: true,
      });
    } else if (guideType === "trail") {
      this.props.hideBottomBar();
      const slug = guide?.slug;
      const title = guide?.name;
      trackScreen("view_guide", slug || title);
      // AnalyticsUtils.logEvent("view_guide", { name: slug });
      this.props.navigation.navigate("TrailScreen", {
        title: title,
        bottomBarOnUnmount: true,
      });
    }
  };

  renderItem = ({ item }) => {
    console.log("the downloaded item", item.progress);
    return (
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
    );
  };

  render() {
    return (
      <FlatList
        style={styles.mainContainer}
        keyExtractor={(item) => `${item.guide.id}`}
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
    selectGuide: (guide) => dispatch(selectCurrentGuide(guide)),
    hideBottomBar: () => dispatch(showBottomBar(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);
