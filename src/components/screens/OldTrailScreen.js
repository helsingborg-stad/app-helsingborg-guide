import React, {
  Component,
} from "react";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  PixelRatio,
} from "react-native";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import {
  connect,
} from "react-redux";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
  AnalyticsUtils,
} from "../../utils/";

import * as subLocationActions from "../../actions/subLoactionActions";
import * as internetActions from "../../actions/internetActions";
import * as downloadActions from "../../actions/downloadActions";

import downloadManager from "../../services/DownloadTasksManager";
import fetchService from "../../services/FetchService";
import LangService from "../../services/langService";

import DownloadItemView2 from "../shared/DownloadItemView2";
import IconTextTouchable from "../shared/IconTextTouchable";
import MapWithListView from "../shared/MapWithListView";
import MapInformationOverlay from "../shared/MapInformationOverlay/MapInformationOverlay";

const infoBarButtonIcon = require("../../images/iconInfo.png");

const styles = StyleSheet.create({
  barButtonItem: {
    opacity: 0.7,
    flexDirection: "row",
    right: 5,
    width: 120,
    height: 44,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barButtonItemImage: {
    margin: 5,
  },
  barButtonItemText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.white,
    },
  ]),
  overlayStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  downloadContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    borderTopColor: Colors.listBackgroundColor,
    borderTopWidth: 2,
    height: PixelRatio.getFontScale() > 1 ? 80 : 40,
    // width: "100%",
    paddingHorizontal: 0,
  },
});

const screenWidth = Dimensions.get("window").width;
const defaultMargin = 17;

class OldTrailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    trailInformation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    const { params = {} } = navigation.state;
    const { toggleInfoOverlay } = params;
    return {
      title,
      headerRight: (
        <TouchableOpacity
          onPress={toggleInfoOverlay}
          style={styles.barButtonItem}
        >
          <Text style={styles.barButtonItemText}>{LangService.strings.INFO}</Text>
          <Image style={styles.barButtonItemImage} source={infoBarButtonIcon} />
        </TouchableOpacity>
      ),
    };
  };

  static trailInformation(trail) {
    return { title: trail.title.plain_text, description: trail.content.plain_text };
  }

  constructor(props) {
    super(props);

    const metadata = this.props.downloadMeta;

    this.state = {
      showInfoOverlay: true,
      subLocation: this.props.subLocation,
      internet: this.props.internet,
      downloadMeta: metadata,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleInfoOverlay: this.toggleInfoOverlay });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });
    if (nextProps.downloadMeta || (this.state.downloadMeta && !nextProps.downloadMeta)) {
      const metadata = nextProps.downloadMeta;

      this.setState({
        downloadMeta: metadata,
      });
    }
  }


  toggleInfoOverlay = () => {
    this.setState({ showInfoOverlay: !this.state.showInfoOverlay });
  }

  // ###############################################################
  // DOWNLOAD ##########################################
  // Method on the subloction download button
  createAndStartTask = () => {
    const item = this.state.subLocation;
    if (!downloadManager.isExist(item.id)) {
      AnalyticsUtils.logEvent("download_guide", { name: item.slug });
      const downloadables = fetchService.scanJsonTree(item);
      const data = { id: item.id, title: item.title.plain_text, avatar: item.guide_images[0].sizes.thumbnail, urls: downloadables };
      downloadManager.createTask(data);
      downloadManager.startTask(item.id);
    }
  };

  closedInfoForTask = () => {
    const item = this.state.subLocation;
    if (downloadManager.isExist(item.id)) {
      downloadManager.setClosedInfo(item.id);
    }
  };

  pauseTask = () => {
    const item = this.state.subLocation;
    if (downloadManager.isExist(item.id)) {
      downloadManager.cancelTask(item.id);
    }
  };

  resumeTask = () => {
    const item = this.state.subLocation;
    if (downloadManager.isExist(item.id)) {
      downloadManager.resumeTask(item.id);
    }
  };

  cancelTask = () => {
    const item = this.state.subLocation;
    if (downloadManager.isExist(item.id)) {
      downloadManager.cancelTask(item.id);
      downloadManager.clearCache(item.id);
    }
  };

  displayDownloadIndicator() {
    const progressBarWidth = screenWidth - (defaultMargin * 2);

    if (this.state.downloadMeta) {
      return (
        <View style={styles.downloadContainer}>
          <DownloadItemView2
            total={this.state.downloadMeta.urls.length}
            currentPos={this.state.downloadMeta.currentPos}
            isCanceled={this.state.downloadMeta.isCanceled}
            progress={this.state.downloadMeta.currentPos / this.state.downloadMeta.urls.length}
            pauseCallback={this.pauseTask}
            resumeCallback={this.resumeTask}
            cancelCallback={this.cancelTask}
            progressBarWidth={progressBarWidth}
          />
        </View>);
    }

    return (
      <View style={styles.downloadContainer}>
        <View style={{ paddingLeft: 16, paddingTop: 6 }}>
          <IconTextTouchable
            text={LangService.strings.DOWNLOAD}
            iconName="get-app"
            onPress={() => this.createAndStartTask()}
          />
        </View>
      </View>
    );
  }

  renderMapInformationOverlay = () => {
    const { trailInformation } = this.props;
    const { showInfoOverlay } = this.state;

    if (!showInfoOverlay) {
      return null;
    }

    return ([
      <TouchableWithoutFeedback
        style={styles.overlayStyle}
        key="TouchableWithoutFeedback"
        onPress={() => this.toggleInfoOverlay()}
      >
        <View
          style={styles.overlayStyle}
          key="overlayView"
        />
      </TouchableWithoutFeedback>,
      <MapInformationOverlay
        key="MapInformationOverlay"
        trailInformation={trailInformation}
        onPressFunction={() => this.toggleInfoOverlay()}
        downloadComponent={() => this.displayDownloadIndicator()}
      />,
    ]);
  }

  render() {
    const { navigation, trailObjects } = this.props;
    const trailItem = trailObjects[0];

    return (
      [<MapWithListView
        key="MapWithListView"
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
        stopAudioOnUnmount
        id={this.state.subLocation.id}
      />,
      this.renderMapInformationOverlay(),
      ]
    );
  }
}

function getSubLocation(subLocations, id) {
  return subLocations.find(item => item.id === id);
}

function getDownloadMeta(downloads, id) {
  return downloads.find(item => item.id === id);
}

function mapStateToProps(state, ownProps) {
  const { trail } = ownProps.navigation.state.params;
  const { id } = ownProps.navigation.state.params.trail;
  const { guides } = state;

  const trailObjects = MapWithListView.createItemsFromTrail(trail, "OldTrailScreen");
  const trailInformation = OldTrailScreen.trailInformation(trail, guides);

  return {
    subLocation: getSubLocation(state.subLocations, id),
    downloadMeta: getDownloadMeta(state.downloads, id),
    downloads: state.downloads,
    internet: state.internet.connected,
    trailObjects,
    trailInformation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
    downloadActions: bindActionCreators(downloadActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OldTrailScreen);
