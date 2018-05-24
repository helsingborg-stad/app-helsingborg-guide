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

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
});

type Props = {
  downloads: OfflineGuide[],
  cancelDownload(guide: Guide): void,
  pauseDownload(guide: Guide): void,
  resumeDownload(guide: Guide): void
};

class DownloadsScreen extends Component<Props> {
  static navigationOptions = () => {
    const title = LangService.strings.OFFLINE_CONTENT;
    return {
      title,
      headerRight: null,
    };
  };

  renderItem = ({ item }) => (
    <DownloadItemView
      title={item.guide.name}
      thumbnail={item.guide.images.thumbnail}
      progress={item.progress}
      isPaused={item.status === "paused"}
      onPausePress={() => this.props.pauseDownload(item.guide)}
      onResumePress={() => this.props.resumeDownload(item.guide)}
      onClearPress={() => this.props.cancelDownload(item.guide)}
    />
  );

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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);
