import React, { Component } from "react";
import { Platform, View, Text, AppState, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ViewContainer from "../shared/view_container";
import Navbar from "../shared/navbar";
import ImageView from "../shared/image_view";
import ContentThumbnail from "../shared/contentThumbnail";
import Footer from "../shared/footer";
import RoundedBtn from "../shared/roundedBtnWithText";
import Keypad from "../shared/KeyPad";
import OptionsFloatingBtn from "../shared/OptionsFloatingBtn";
import OptionsView from "../shared/OptionsView";
import OptionsContentView from "../shared/OptionsContentView";
import DownloadItemView2 from "../shared/DownloadItemView2";

import { LangService } from "../../services/langService";
import MediaPlayer from "../shared/MediaPlayer";
import * as subLocationActions from "../../actions/subLoactionActions";
import * as internetActions from "../../actions/internetActions";
import * as downloadActions from "../../actions/downloadActions";

import MediaService from "../../services/mediaService";

import { BeaconService } from "../../services/beaconService";
import { BeaconServiceiOS } from "../../services/beaconServiceiOS";
import RadarView from "../shared/RadarView2";
import FloatingBtn from "../shared/FloatingBtn";

import SlimNotificationBar from "../shared/SlimNotificationBar";
import NoInternetText from "../shared/noInternetText";
import DownloadTasksManager from "../../services/DownloadTasksManager";
import { FetchService } from "../../services/FetchService";

const HALF_WIDTH = Dimensions.get("window").width / 2;
const BEACON_REGION_ID = "edd1ebeac04e5defa017";
const RADAR_SCANNING_PERIOD = 1000; // ms
const RADAR_SCANNING_DIE_PERIOD = 1000; // ms

const styles = StyleSheet.create({
  scrollView: { paddingBottom: 70 },
  imageViewContainer: { flex: 1, backgroundColor: "white" },
  bodyContainer: {
    flex: 1,

    alignItems: "stretch",
    backgroundColor: "white",
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 16,
    paddingBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "300", lineHeight: 26 },
  articleContainer: { flex: 4, paddingHorizontal: 34, paddingVertical: 10 },
  article: { fontSize: 14, lineHeight: 25 },
  objectsContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 50,
  },
  ContentThumbnailContainer: {
    width: HALF_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  closeBtnContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomWidth: 4,
    borderBottomColor: "#ebebeb",
  },
  nearByTextContainer: { paddingHorizontal: 34, paddingVertical: 20, justifyContent: "center" },
  nearByText: { fontSize: 18, lineHeight: 21 },
  fabBtn: { width: 40, height: 40, backgroundColor: "#D35098" },
});

class SubLocationView extends Component {
  static get defaultProps() {
    return {
      title: "SubLocation",
    };
  }

  static getRemainingObjectKeys(allKeys, subKeys) {
    if (allKeys.length === 0) return [];
    if (subKeys.length === 0) return allKeys;

    return allKeys.filter(key => !subKeys.includes(key));
  }

  constructor(props) {
    super(props);

    this.state = {
      subLocation: this.props.subLocation,
      viewArticle: false,
      keypadVisible: false,
      closestBeacon: {},
      searching: true,
      smallBtnVisible: false,
      radarInFocus: true,
      menuVisible: false,
      internet: this.props.internet,
      keypadSearchResultCode: 0,
      downloadMeta: this.props.downloadMeta,
    };
    this.currentYOffset = 0;
    if (Platform.OS === "ios") {
      this.beaconService = BeaconServiceiOS.getInstance();
    } else {
      this.beaconService = BeaconService.getInstance();
    }

    this.downloadManager = DownloadTasksManager.getInstance();
    this.fetchService = FetchService.getInstance();
    this.mediaService = MediaService.getInstance();

    this.onBeaconRangingResult = this.onBeaconRangingResult.bind(this);
    this.startListeningToBeacons = this.startListeningToBeacons.bind(this);
    this.onBeaconServiceConnected = this.onBeaconServiceConnected.bind(this);

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    this.initBeaconService();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });
    if (nextProps.downloadMeta || (this.state.downloadMeta && !nextProps.downloadMeta)) {
      this.setState({ downloadMeta: nextProps.downloadMeta });
    }
  }

  componentWillUnmount() {
    this.mediaService.release();
    this.unbindBeaconService();
    clearTimeout(this.smallBtnTimer);
    clearTimeout(this.beaconSearchTimeout);
    clearTimeout(this.beaconSearchStopTimeout);
  }

  _goToContentObjectScene(contentObject, objectKey) {
    const { navigate } = this.props.navigation;
    navigate("ObjectView", { contentObject, objectKey, subLocationId: this.state.subLocation.id });
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
          this.setState({ closestBeacon: {}, searching: false });
          clearInterval(this.beaconSearchStopTimeout);
          this.beaconSearchStopTimeout = null;
        }, RADAR_SCANNING_DIE_PERIOD);
      }
    };

    const showRadarForSecondsThenLoad = () => {
      clearInterval(this.beaconSearchStopTimeout);
      this.beaconSearchStopTimeout = null;
      this.setState({ closestBeacon: {}, searching: true });
      if (!this.beaconSearchTimeout) {
        this.beaconSearchTimeout = setTimeout(() => {
          this.setState({ closestBeacon: closest, searching: false });
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
      this.setState({ closestBeacon: closest, searching: false });
      clearInterval(this.beaconSearchTimeout);
      this.beaconSearchTimeout = null;
      this.smallBtnTimer = null;
      this.beaconService.notify();
    } else {
      // check if the user at the top of the page, if not show the small button and return nothing.
      if (!this.state.radarInFocus) {
        // show the small button on screen
        this.refreshSmallBtn();
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
    const remainingKeys = SubLocationView.getRemainingObjectKeys(allKeys, nearByKeys);

    const radar = <RadarView title={LangService.strings.SEARCH_AROUND} visible={this.state.searching} />;
    const contentObjectsViews = this.getObjectsViews(remainingKeys);
    const nearByObjectsViews = this.getObjectsViews(nearByKeys);

    let cc;
    if (this.state.searching) cc = <View>{radar}</View>;
    else if (Object.keys(this.state.closestBeacon).length) {
      cc = (
        <View>
          <View style={styles.nearByTextContainer}>
            <Text style={styles.nearByText}>{LangService.strings.SOMETHING_NEAR_BY}</Text>
          </View>
          <View style={[styles.objectsContainer, { borderBottomWidth: 2, borderBottomColor: "#cecece" }]}>{nearByObjectsViews}</View>
        </View>
      );
    }

    return (
      <View>
        <View>{cc}</View>
        <View style={styles.objectsContainer}>{contentObjectsViews}</View>
      </View>
    );
  }

  updateClosestFromSmallBtn() {
    if (this.readyBeacon) {
      this.setState({ closestBeacon: this.readyBeacon, searching: false });
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

    const getMetric = (objectKey) => {
      const metric = this.props.metrics.find(item => item.objectKey === objectKey);
      return metric || { isVisited: false };
    };

    const co = keys.map((key) => {
      let mImage = {};

      const metric = getMetric(key);
      if (contentObjects[key].image && contentObjects[key].image.length) {
        mImage = contentObjects[key].image[0].sizes;
      }

      const text = (
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Text style={{ fontSize: 16, fontWeight: "300", marginVertical: 3 }}>{`#${contentObjects[key].id}`}</Text>
          <Text style={{ fontSize: 14, marginVertical: 3 }}>{contentObjects[key].title}</Text>
        </View>
      );

      return (
        <TouchableOpacity
          key={key}
          // activeOpacity ={0.8}
          onPress={() => {
            this._goToContentObjectScene(contentObjects[key], key);
          }}
          style={[styles.ContentThumbnailContainer]}
        >
          <ContentThumbnail
            imageSource={{ uri: mImage.medium_large }}
            width={mImage["medium_large-width"]}
            height={mImage["medium_large-height"]}
            checked={metric.isVisited || false}
          >
            {text}
          </ContentThumbnail>
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
    if (!this.downloadManager.isExist(item.id)) {
      const downloadables = this.fetchService.scanJsonTree(item);
      const data = { id: item.id, title: item.title.plain_text, avatar: item.guide_images[0].sizes.thumbnail, urls: downloadables };
      this.downloadManager.createTask(data);
      this.downloadManager.startTask(item.id);
    }
  };

  // #################################################

  toggleMenu() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  hideMenu = () => {
    if (this.state.menuVisible) this.setState({ menuVisible: false });
  };

  displayDownloadIndicator() {
    return this.state.downloadMeta ? (
      <DownloadItemView2
        total={this.state.downloadMeta.urls.length}
        currentPos={this.state.downloadMeta.currentPos}
        isCanceled={this.state.downloadMeta.isCanceled}
        progress={this.state.downloadMeta.currentPos / this.state.downloadMeta.urls.length}
      />
    ) : null;
  }

  displayMainImage() {
    const images = this.state.subLocation.guide_images;

    // //console.log('images',images);
    if (images && images.length) {
      return (
        <ImageView source={{ uri: images[0].sizes.large }} width={images[0].sizes["large-width"]} height={images[0].sizes["large-width"]} />
      );
    }
    return null;
  }
  displayArticle() {
    const article = (
      <View style={styles.articleContainer}>
        <Text style={{ fontSize: 19, lineHeight: 21, marginVertical: 10 }}>
          {`${LangService.strings.ABOUT} ${this.state.subLocation.title.plain_text}`}
        </Text>
        <Text style={styles.article}>{this.state.subLocation.content.plain_text}</Text>
      </View>
    );

    if (this.state.viewArticle) return article;
    return null;
  }

  toggleArticleView() {
    this.hideMenu();
    this.setState({ viewArticle: !this.state.viewArticle });
  }

  toggleMainMenu = () => {
    this.props.navigation.navigate("DrawerToggle");
  };

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
      console.log("no result found");
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

  toggleKeypadVisibility() {
    this.toggleMenu();
    this.setState({ keypadVisible: !this.state.keypadVisible });
  }
  // #############################################

  refreshSmallBtn() {
    if (!this.smallBtnTimer) {
      this.setState({ smallBtnVisible: true });
      this.smallBtnTimer = setTimeout(() => {
        this.closeSmallBtn();
      }, 5000);
    }
  }
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

  displayFabs() {
    return (
      <OptionsContentView>
        <RoundedBtn
          style={styles.fabBtn}
          label={LangService.strings.SEARCH_BY_NUMBER}
          active={<Icon2 name="search" size={20} color="white" />}
          idle={<Icon2 name="search" size={20} color="white" />}
          onPress={() => {
            this.toggleKeypadVisibility();
          }}
        />
        <RoundedBtn
          style={styles.fabBtn}
          label={this.state.viewArticle ? LangService.strings.CLOSE_MORE_INFO : LangService.strings.MORE_INFO}
          isActive={this.state.viewArticle}
          disabled={!this.state.subLocation.content || this.state.subLocation.content.plain_text === ""}
          active={<Icon2 name="close" size={20} color="white" />}
          idle={<Icon name="info" size={20} color="white" />}
          onPress={() => this.toggleArticleView()}
        />
        <RoundedBtn
          style={styles.fabBtn}
          label={LangService.strings.DOWNLOAD}
          active={<Icon2 name="file-download" size={20} color="white" />}
          idle={<Icon2 name="file-download" size={20} color="white" />}
          onPress={this.createAndStartTask}
        />
      </OptionsContentView>
    );
  }

  onSmallBtnPressed = () => {
    this.scrollView.scrollTo({ x: 0, y: 100, animated: true });
    this.updateClosestFromSmallBtn();
    this.closeSmallBtn();
  };

  closeSmallBtn() {
    this.setState({ smallBtnVisible: false });
    clearInterval(this.smallBtnTimer);
  }

  display() {
    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigation.goBack()}>
        <Icon2 name="chevron-left" size={32} color="white" />
      </TouchableOpacity>
    );
    const rightBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={this.toggleMainMenu}>
        <Icon2 name="menu" size={20} color="white" />
      </TouchableOpacity>
    );

    if (this.state.subLocation && Object.keys(this.state.subLocation).length) {
      return (
        <ViewContainer>
          <SlimNotificationBar visible={!this.state.internet} style={{ top: 50 }}>
            <NoInternetText />
          </SlimNotificationBar>

          <Navbar title={this.state.subLocation.guidegroup[0].name} leftButton={leftBtn} rightButton={rightBtn} backgroundColor="#7B075E" />
          <FloatingBtn onPress={this.onSmallBtnPressed} visible={this.state.smallBtnVisible} content={LangService.strings.NEW_CONTENT} />

          <OptionsFloatingBtn onPress={this.toggleMenu} />

          <OptionsView onPress={this.hideMenu} visible={this.state.menuVisible}>
            {this.displayFabs()}
          </OptionsView>

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
              <ViewContainer style={{ height: 30 }}>{this.displayDownloadIndicator()}</ViewContainer>

              <View style={styles.bodyContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{this.state.subLocation.title.plain_text}</Text>
                </View>
                <View>{this.displayArticle()}</View>
                <View>{this.displayContent()}</View>
              </View>
            </ScrollView>
          </View>
          {this.displayKeypad()}
          <Footer>
            <MediaPlayer />
          </Footer>
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
  const { subLocationId } = ownProps.navigation.state.params;
  return {
    subLocation: getSubLocation(state.subLocations, subLocationId),
    metrics: state.metrics,
    internet: state.internet.connected,
    downloadMeta: getDownloadMeta(state.downloads, subLocationId),
    downloads: state.downloads,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
    downloadActions: bindActionCreators(downloadActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubLocationView);
