// @flow
import React, { Component } from "react";
import { View, ListView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import ViewContainer from "../shared/view_container";
import DownloadItemView from "../shared/DownloadItemView";
import LangService from "../../services/langService";
import { Colors } from "../../styles/";
import {
  cancelDownloadGuide,
  pauseDownloadGuide,
  resumeDownloadGuide,
} from "../../actions/downloadGuidesActions";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
  footer: {
    height: 60,
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

  static renderFooter = () => <View style={styles.footer} />;

  renderRow = (item: OfflineGuide) => (
    <DownloadItemView
      key={item.guide.id}
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
      <ViewContainer style={styles.mainContainer}>
        <ListView
          enableEmptySections
          dataSource={ds.cloneWithRows(this.props.downloads)}
          renderRow={this.renderRow}
          renderFooter={DownloadsScreen.renderFooter}
        />
      </ViewContainer>
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
