import React, { Component } from "react";
import { Platform, View, Text, AppState, TouchableOpacity, Image, StyleSheet, ScrollView, TouchableWithoutFeedback } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as subLocationActions from "../../actions/subLoactionActions";
import * as internetActions from "../../actions/internetActions";
import * as downloadActions from "../../actions/downloadActions";
import selectCurrentContentObject from "../../actions/uiStateActions";

import { BeaconService } from "../../services/beaconService";
import { BeaconServiceiOS } from "../../services/beaconServiceiOS";
import downloadManager from "../../services/DownloadTasksManager";
import fetchService from "../../services/FetchService";
import LangService from "../../services/langService";
import MediaService from "../../services/mediaService";

import ContentThumbnail from "../shared/contentThumbnail";
import DownloadItemView2 from "../shared/DownloadItemView2";
import Footer from "../shared/footer";
import IconTextTouchable from "../shared/IconTextTouchable";
import ImageView from "../shared/image_view";
import Keypad from "../shared/KeyPad";
import MapInformationOverlay from "../shared/MapInformationOverlay";
import NoInternetText from "../shared/noInternetText";
import SlimNotificationBar from "../shared/SlimNotificationBar";
import ViewContainer from "../shared/view_container";

import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
  AnalyticsUtils,
} from "../../utils/";

const searchIcon = require("../../images/search-id.png");
const iconKids = require("../../images/kids.png");
const alphaGradient = require("../../images/gradient.png");

const BEACON_REGION_ID = "edd1ebeac04e5defa017";
const RADAR_SCANNING_PERIOD = 1000; // ms
const RADAR_SCANNING_DIE_PERIOD = 1000; // ms

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 70,
  },
  imageViewContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  barButtonItem: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 14,
    opacity: 0.75,
  },
  barButtonItemText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.white,
      marginRight: 8,
    },
  ]),
  barButtonItemImage: {
    height: 16,
    width: 16,
  },
  downloadContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    borderBottomColor: Colors.listBackgroundColor,
    borderBottomWidth: 2,
    height: 40,
    paddingHorizontal: 0,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 30,
      fontWeight: "300",
      lineHeight: 36,
      color: Colors.black,
    }],
  ),
  date: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.warmGrey,
    }],
  ),
  forChildrenText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.darkGrey,
      marginLeft: 6,
      fontWeight: "500",
      textAlign: "left",
    }],
  ),
  forChildrenContainer: {
    paddingTop: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  forChildrenIcon: {
    width: 17,
    height: 17,
  },
  alphaGradient: {
    marginTop: -30,
    width: "100%",
    height: 30,
  },
  readMoreText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.purple,
    },
  ]),
  articleContainer: {
    flex: 1,
    paddingVertical: 0,
  },
  article: {
    fontSize: 16,
    lineHeight: 22,
    paddingTop: 20,
    color: Colors.darkGrey,
  },
  objectsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 50,
  },
  contentContainer: {
    flex: 0,
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 20,
  },
  ContentThumbnail: {
    flex: 1,
  },
  ContentTextContainer: {
    flex: 1,
    paddingBottom: 44,
  },
  idText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 14,
      fontWeight: "500",
      lineHeight: 20,
      color: Colors.warmGrey,
    }],
  ),
  contentNameText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      lineHeight: 19,
      color: Colors.black,
    }],
  ),
});

function getTruncatedTitle(longTitle) {
  if (longTitle.length <= 16) {
    return longTitle;
  }
  return `${longTitle.substring(0, 14)}...`;
}

function renderDate(startDate, endDate) {
  if (startDate === null || endDate === null) { return null; }

  return <Text style={styles.date} numberOfLines={1}>{`${startDate} - ${endDate}`}</Text>;
}

function displayForChildren() {
  return (
    <View style={styles.forChildrenContainer} >
      <Image source={iconKids} resizeMode="contain" style={styles.forChildrenIcon} />
      <Text style={styles.forChildrenText}>{LangService.strings.FOR_CHILDREN}</Text>
    </View>
  );
}

class GuideDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    const { params = {} } = navigation.state;
    const { toggleKeypad } = params;
    return {
      title,
      headerRight: (
        <TouchableOpacity
          onPress={toggleKeypad}
          style={styles.barButtonItem}
        >
          <Text style={styles.barButtonItemText}>{LangService.strings.SEARCH_BY_NUMBER_SHORT}</Text>
          <Image style={styles.barButtonItemImage} source={searchIcon} />
        </TouchableOpacity>
      ),
    };
  };

  static get defaultProps() {
    return {
      title: "GuideDetailsScreen",
    };
  }

  static getRemainingObjectKeys(allKeys, subKeys) {
    if (allKeys.length === 0) return [];
    if (subKeys.length === 0) return allKeys;

    return allKeys.filter(key => !subKeys.includes(key));
  }

  constructor(props) {
    super(props);

    const metadata = this.props.downloadMeta;

    this.state = {
      subLocation: this.props.subLocation,
      keypadVisible: false,
      closestBeacon: {},
      radarInFocus: true,
      menuVisible: false,
      internet: this.props.internet,
      keypadSearchResultCode: 0,
      downloadMeta: metadata,
      collapsed: true,
      closedInfoOverlay: metadata ? metadata.closedInfo : false,
      isDownloadComplete: metadata ? metadata.urls.length <= metadata.currentPos && metadata.urls.length > 0 : false,
    };
    this.currentYOffset = 0;
    if (Platform.OS === "ios") {
      this.beaconService = BeaconServiceiOS.getInstance();
    } else {
      this.beaconService = BeaconService.getInstance();
    }

    this.mediaService = MediaService.getInstance();

    this.onBeaconRangingResult = this.onBeaconRangingResult.bind(this);
    this.startListeningToBeacons = this.startListeningToBeacons.bind(this);
    this.onBeaconServiceConnected = this.onBeaconServiceConnected.bind(this);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeInfoOverlay = this.closeInfoOverlay.bind(this);
  }

  componentDidMount() {
    // this.initBeaconService();
    this.props.navigation.setParams({ toggleKeypad: this.toggleKeypadVisibility });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });
    if (nextProps.downloadMeta || (this.state.downloadMeta && !nextProps.downloadMeta)) {
      const metadata = nextProps.downloadMeta;

      this.setState({
        downloadMeta: metadata,
        closedInfoOverlay: metadata ? metadata.closedInfo : false,
        isDownloadComplete: metadata ? metadata.urls.length <= metadata.currentPos && metadata.urls.length > 0 : false,
      });
    }
  }

  componentWillUnmount() {
    this.mediaService.release();
    // this.unbindBeaconService();
    clearTimeout(this.smallBtnTimer);
    clearTimeout(this.beaconSearchTimeout);
    clearTimeout(this.beaconSearchStopTimeout);
    this.state.collapsed = true;
  }

  _goToContentObjectScene(contentObject/* , objectKey */) {
    const { navigate } = this.props.navigation;
    const { title } = contentObject;

    this.props.dispatchSelectContentObject(this.state.subLocation.id, contentObject.id);

    AnalyticsUtils.logEvent("view_object", { name: contentObject.title });

    navigate("ObjectScreen", { title, currentGuideType: this.state.subLocation.contentType }); // TODO: use contenttype from new data type.
  }

  // ############################################
  // BEACON SEGMENT
  // ############################################
  initBeaconService() {
    this.beaconService.checkBluetooth();
    this.beaconService.init();
    this.beaconService.onRangingResult(this.onBeaconRangingResult);
    this.beaconService.onServiceConnected(this.onBeaconServiceConnected);
  }

  unbindBeaconService() {
    this.stopListeningToBeacons();
    this.beaconService.unSubscribeOnRangingResult(this.onBeaconRangingResult);
    this.beaconService.unSubscribeOnServiceConnected(this.onBeaconServiceConnected);
    this.beaconService.unbind();
  }

  startListeningToBeacons() {
    this.beaconService.startRanging(BEACON_REGION_ID);
  }

  stopListeningToBeacons() {
    this.beaconService.stopRanging(BEACON_REGION_ID);
  }

  filterBeacons(beacons) {
    // No beacon detected case
    if (!beacons || !beacons.length) return [];
    // The guide does not have subAttractions attached to beacons.
    const { subAttractions } = this.state.subLocation;
    if (!subAttractions || !subAttractions.length) return [];

    // check if the beacons belonge to one of the subAttractions and they are within distance.
    return beacons.filter((_beacon) => {
      const subAttraction = subAttractions.find((item) => {
        const belongingConditions = `0x${item.nid}` === _beacon.nid && `0x${item.bid}` === _beacon.bid;
        const distanceCondition = parseFloat(item.beacon_distance) > parseFloat(_beacon.distance);
        return belongingConditions && distanceCondition;
      });
      return !!subAttraction;
    });
  }

  onBeaconRangingResult(data) {
    let beacons = this.beaconService.getOptimizedDistanceBeacons(data.beacons);
    beacons = this.filterBeacons(beacons);
    const closest = this.beaconService.getTheClosest(beacons);
    const { guideBeacon } = this.state.subLocation;

    const hideRadar = () => {
      clearInterval(this.beaconSearchTimeout);
      this.beaconSearchTimeout = null;
      if (!this.beaconSearchStopTimeout) {
        this.beaconSearchStopTimeout = setTimeout(() => {
          this.setState({ closestBeacon: {} });
          clearInterval(this.beaconSearchStopTimeout);
          this.beaconSearchStopTimeout = null;
        }, RADAR_SCANNING_DIE_PERIOD);
      }
    };

    const showRadarForSecondsThenLoad = () => {
      clearInterval(this.beaconSearchStopTimeout);
      this.beaconSearchStopTimeout = null;
      this.setState({ closestBeacon: {} });
      if (!this.beaconSearchTimeout) {
        this.beaconSearchTimeout = setTimeout(() => {
          this.setState({ closestBeacon: closest });
          clearInterval(this.beaconSearchTimeout);
          this.beaconSearchTimeout = null;
          this.smallBtnTimer = null;
        }, RADAR_SCANNING_PERIOD);
      }
    };

    const storedClosestBeaconIsInTheList = () => {
      if (!beacons.length) return false;
      const index = beacons.findIndex(item => item.bid === this.state.closestBeacon.bid);
      return index !== -1;
    };

    if (!Object.keys(closest).length && Object.keys(this.state.closestBeacon).length) {
      return;
    }

    if (!closest || !guideBeacon || closest.nid !== `0x${guideBeacon.nid}`) {
      hideRadar();
      return;
    }

    if (closest.bid === this.state.closestBeacon.bid && closest.nid === this.state.closestBeacon.nid) {
      this.setState({ closestBeacon: closest });
      return;
    }

    const closerDistanceCondition = parseFloat(this.state.closestBeacon.distance) - parseFloat(closest.distance) < -2;

    if ((true || storedClosestBeaconIsInTheList()) && closerDistanceCondition) {
      return;
    }

    // Beacon detection logic ends here
    // #########################################
    if (AppState.currentState === "background") {
      this.setState({ closestBeacon: closest });
      clearInterval(this.beaconSearchTimeout);
      this.beaconSearchTimeout = null;
      this.smallBtnTimer = null;
      this.beaconService.notify();
    } else {
      // check if the user at the top of the page, if not show the small button and return nothing.
      if (!this.state.radarInFocus) {
        // show the small button on screen
        // this.refreshSmallBtn(); // What small button...? This function doesn't even exist....
        // -stop any timeout to prevent showing the list.
        if (this.beaconSearchTimeout) {
          clearInterval(this.beaconSearchTimeout);
          this.beaconSearchTimeout = null;
        }
        // Put the closest beacon in ready Beacon, to use it when the small btn is clicked.
        this.readyBeacon = closest;
        return;
      }

      // If everything is ok, start search animation for couple of seconds and update the lists.
      // console.log('new beacon will take place ************************************');
      showRadarForSecondsThenLoad();
    }
  }

  onBeaconServiceConnected() {
    this.startListeningToBeacons();
  }

  displayContent() {
    const { contentObjects } = this.state.subLocation;

    if (!contentObjects || Object.keys(contentObjects).length === 0) return null;

    const allKeys = Object.keys(contentObjects);
    const nearByKeys = this.getNearByObjectsKeys();
    const remainingKeys = GuideDetailsScreen.getRemainingObjectKeys(allKeys, nearByKeys);
    const contentObjectsViews = this.getObjectsViews(remainingKeys);

    let cc;
    return (
      <View>
        <View>{cc}</View>
        <View style={styles.objectsContainer}>{contentObjectsViews}</View>
      </View>
    );
  }

  updateClosestFromSmallBtn() {
    if (this.readyBeacon) {
      this.setState({ closestBeacon: this.readyBeacon });
      this.readyBeacon = null;
    }
  }

  getNearByObjectsKeys() {
    const { subAttractions } = this.state.subLocation;
    const { contentObjects } = this.state.subLocation;

    if (
      !contentObjects ||
      !Object.keys(contentObjects).length ||
      !subAttractions ||
      !subAttractions.length ||
      !Object.keys(this.state.closestBeacon).length
    ) {
      return [];
    }

    const nearByBID = this.state.closestBeacon.bid;
    const subAttraction = subAttractions.find(item => `0x${item.bid}` === nearByBID);
    if (!subAttraction) return [];

    return subAttraction.content[0].split(",");
  }
  getObjectsViews(keys) {
    if (!keys.length) return null;

    const { contentObjects } = this.state.subLocation;

    const co = keys.map((key) => {
      let mImage = {};

      if (contentObjects[key].image && contentObjects[key].image.length) {
        mImage = contentObjects[key].image[0].sizes;
      }

      const text = (
        <View style={{ position: "absolute" }}>
          <View>
            <Text style={styles.idText}>
              {`ID #${contentObjects[key].id}`}
            </Text>
          </View>
          <View style={{ width: 150 }}>
            <Text style={styles.contentNameText} numberOfLines={2}>{contentObjects[key].title}</Text>
          </View>
        </View >
      );

      return (
        <TouchableOpacity
          key={key}
          onPress={() => {
            this._goToContentObjectScene(contentObjects[key], key);
          }}
          style={styles.contentContainer}

        >
          <ContentThumbnail
            style={styles.ContentThumbnail}
            imageSource={{ uri: mImage.medium_large }}
            width={mImage["medium_large-width"]}
            height={mImage["medium_large-height"]}
            guideID={this.state.subLocation.id}
          />
          <View style={styles.ContentTextContainer}>
            {text}
          </View>
        </TouchableOpacity>
      );
    });

    return co;
  }

  // ###############################################################
  // DOWNLOAD ##########################################
  // Method on the subloction download button
  createAndStartTask = () => {
    this.toggleMenu();
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

  // #################################################

  toggleMenu() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  hideMenu = () => {
    if (this.state.menuVisible) this.setState({ menuVisible: false });
  };

  closeInfoOverlay() {
    this.setState({ closedInfoOverlay: this.state.closedInfoOverlay });
    this.closedInfoForTask();
  }

  displayDownloadIndicator() {
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

  displayMainImage() {
    const images = this.state.subLocation.guide_images;

    if (images && images.length) {
      return (
        <ImageView source={{ uri: images[0].sizes.large }} guideID={this.state.subLocation.id} />
      );
    }
    return null;
  }

  displayArticle() {
    const article = (
      <View style={styles.articleContainer}>
        <Text style={[TextStyles.defaultFontFamily, { fontSize: 16, lineHeight: 21, marginVertical: 0 }]}>
          {this.state.subLocation.guide_tagline}
        </Text>
        {renderDate(this.state.subLocation.guide_date_start, this.state.subLocation.guide_date_end)}
        {this.state.subLocation.guide_kids && displayForChildren()}
        {this.renderContentText()}
      </View>
    );

    return article;
  }

  renderInfoOverlay = () => {
    const { closedInfoOverlay, isDownloadComplete } = this.state;

    if (closedInfoOverlay || !isDownloadComplete) {
      return null;
    }

    return ([
      <TouchableWithoutFeedback
        style={styles.overlayStyle}
        key="TouchableWithoutFeedback"
        onPress={() => this.closeInfoOverlay()}
      >
        <View
          style={styles.overlayStyle}
          key="overlayView"
        />
      </TouchableWithoutFeedback>,
      <MapInformationOverlay
        key="MapInformationOverlay"
        trailInformation={{ description: LangService.strings.DOWNLOADED_INFO }}
        onPressFunction={() => this.closeInfoOverlay()}
      />,
    ]);
  }

  renderContentText() {
    if (!this.state.subLocation.content) { return null; }

    let textChunk = this.state.subLocation.content.plain_text;
    let content = null;

    if (this.state.collapsed && textChunk) {
      if (textChunk.length > 100) {
        textChunk = `${textChunk.substring(0, 100)}...`;
        content = (
          <View>
            <Text style={styles.article}>{textChunk}</Text>
            <Image source={alphaGradient} resizeMode="stretch" style={styles.alphaGradient} />
            <TouchableOpacity onPress={() => this.toggleCollapsedContent()}>
              <Text style={styles.readMoreText}>{LangService.strings.READ_MORE}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      content = (<Text style={styles.article}>{textChunk}</Text>);
    }
    return content;
  }

  toggleCollapsedContent() {
    this.setState({ collapsed: !this.state.collapsed });
  }


  // Search feature segment
  // ############################################

  setKeypadSearchResultCode(value) {
    this.setState({ keypadSearchResultCode: value });
  }

  onSearch = (id) => {
    const contentObject = this.getContentObjectById(id);
    if (contentObject) {
      this.setKeypadSearchResultCode(200);
      this.toggleKeypadVisibility();
      this.hideMenu();
      this._goToContentObjectScene(contentObject.object, contentObject.objectKey);
    } else {
      this.setKeypadSearchResultCode(404);
    }
  };

  getContentObjectById(id) {
    const { contentObjects } = this.state.subLocation;
    const keys = Object.keys(contentObjects);
    const targetKey = keys.find(key => contentObjects[key].id === id);
    if (!targetKey) return null;
    return { object: contentObjects[targetKey], objectKey: targetKey };
  }

  displayKeypad() {
    return (
      <Keypad
        visible={this.state.keypadVisible}
        onSearch={this.onSearch}
        resultCode={this.state.keypadSearchResultCode}
        onClose={() => this.toggleKeypadVisibility()}
      />
    );
  }

  toggleKeypadVisibility = () => {
    this.setState({ keypadVisible: !this.state.keypadVisible });
  }
  // #############################################

  watchTheScroll(e) {
    const SCROLL_THRESHOLD = 450;
    const yOffset = e.nativeEvent.contentOffset.y;
    if (yOffset < SCROLL_THRESHOLD) {
      if (!this.state.radarInFocus) this.setState({ radarInFocus: true });
    } else if (this.state.radarInFocus) this.setState({ radarInFocus: false });
  }
  onScroll(e) {
    this.watchTheScroll(e);
  }

  display() {
    if (this.state.subLocation && Object.keys(this.state.subLocation).length) {
      return (
        <ViewContainer>
          <SlimNotificationBar visible={!this.state.internet} style={{ top: 50 }}>
            <NoInternetText />
          </SlimNotificationBar>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              ref={(ref) => {
                this.scrollView = ref;
              }}
              onScroll={e => this.onScroll(e)}
              scrollEventThrottle={100}
            >
              <View style={styles.imageViewContainer}>{this.displayMainImage()}</View>
              {this.displayDownloadIndicator()}
              <View style={styles.bodyContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{getTruncatedTitle(this.state.subLocation.title.plain_text)}</Text>
                </View>
                <View>{this.displayArticle()}</View>
                <View>{this.displayContent()}</View>
              </View>
            </ScrollView>
          </View>
          {this.displayKeypad()}
          {this.renderInfoOverlay()}
        </ViewContainer>
      );
    }

    return null;
  }

  render() {
    return this.display();
  }
}

function getSubLocation(subLocations, id) {
  return subLocations.find(item => item.id === id);
}
function getDownloadMeta(downloads, id) {
  return downloads.find(item => item.id === id);
}

function mapStateToProps(state, ownProps) {
  const { id } = ownProps.navigation.state.params;
  return {
    subLocation: getSubLocation(state.subLocations, id),
    metrics: state.metrics,
    internet: state.internet.connected,
    downloadMeta: getDownloadMeta(state.downloads, id),
    downloads: state.downloads,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
    downloadActions: bindActionCreators(downloadActions, dispatch),

    dispatchSelectContentObject: (guideID, contentObjectID) => {
      dispatch(selectCurrentContentObject(guideID, contentObjectID));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideDetailsScreen);

