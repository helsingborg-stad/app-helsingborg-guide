import React, { Component } from "react";
import { View, ListView, StyleSheet, TouchableOpacity } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewContainer from "../shared/view_container";
import downloadManager from "../../services/DownloadTasksManager";
import DownloadItemView from "../shared/DownloadItemView";
import * as downloadActions from "../../actions/downloadActions";
import FetchService from "../../services/FetchService";
import Navbar from "../shared/navbar";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const styles = StyleSheet.create({
  fo: {
    color: "#D35098",
  },
  mainContainer: {
    backgroundColor: "#F2F2F2",
  },
  itemsScroll: {},
});

class DownloadManagerView extends Component {
  static renderFooter() {
    return <View style={{ height: 60 }} />;
  }

  static clearCache(id) {
    downloadManager.clearCache(id);
  }

  static toggleTask(id) {
    if (downloadManager.isExist(id)) {
      const task = downloadManager.getTaskById(id);
      if (task.isCanceled) downloadManager.resumeTask(task.id);
      else downloadManager.cancelTask(task.id);
    }
  }

  constructor(props) {
    super(props);

    this.title = props.navigation.state.params.title;
    this.fetchService = FetchService.getInstance();
  }

  // #################################################

  renderRow = item => (
    <DownloadItemView
      key={item.id}
      imageSource={{ uri: item.avatar }}
      title={item.title}
      total={item.urls.length}
      currentPos={item.currentPos}
      isCanceled={item.isCanceled}
      progress={item.currentPos / item.urls.length}
      onClosePress={() => DownloadManagerView.toggleTask(item.id)}
      onClearPress={() => DownloadManagerView.clearCache(item.id)}
    />
  );

  render() {
    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigation.goBack()}>
        <Icon name="chevron-left" size={32} color="white" />
      </TouchableOpacity>
    );
    return (
      <ViewContainer style={styles.mainContainer}>
        <Navbar title={this.title} leftButton={leftBtn} backgroundColor="#7B075E" />
        <ListView
          ref={(ref) => {
            this.itemsListView = ref;
          }}
          enableEmptySections
          dataSource={ds.cloneWithRows(this.props.downloads)}
          renderRow={this.renderRow}
          renderFooter={DownloadManagerView.renderFooter}
        />
      </ViewContainer>
    );
  }
}

// store config
function mapStateToProps(state) {
  return {
    downloads: state.downloads,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    downloadActions: bindActionCreators(downloadActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DownloadManagerView);
