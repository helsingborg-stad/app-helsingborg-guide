import React, {
  Component,
} from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  ViewPagerAndroid,
  Text,
  Image,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  AnalyticsUtils,
  StyleSheetUtils,
  LocationUtils,
  UrlUtils,
} from "../../utils/";
import LangService from "../../services/langService";
import IconTextTouchable from "./IconTextTouchable";

const ios = Platform.OS === "ios";

const defaultMargin = 20;
const textMargin = 13;
const listItemImageSize = 120;

// Marker image
const markerImageActiveWidth = 42;
const markerImageInactiveWidth = 32;

const markerImageActiveHeight = 60;
const markerImageInactiveHeight = 46;

const screenWidth = Dimensions.get("window").width;
const listItemWidth = screenWidth - (defaultMargin * 2);

const locationMarkerActive = require("../../images/map/marker-location-active.png");
const locationMarkerInactive = require("../../images/map/marker-location.png");

const trailMarkerActive = require("../../images/map/marker-trail-active.png");
const trailMarkerInactive = require("../../images/map/marker-trail.png");

const numberedMarkerActive = require("../../images/map/marker-number-active.png");
const numberedMarkerInactive = require("../../images/map/marker-number.png");

/*
* Shared style constants
*/

const listItemShared = {
  backgroundColor: Colors.white,
  flexDirection: "row",
  height: listItemImageSize,
  width: listItemWidth,
  marginVertical: defaultMargin / 2,
  elevation: 4,
  shadowColor: "rgba(0, 0, 0, 0.23)",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 5,
  shadowOpacity: 1,
};

/*
* Stylesheet
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    position: "absolute",
    bottom: listItemImageSize + defaultMargin,
    left: 0,
    right: 0,
    top: 0,
  },
  listStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: listItemImageSize + defaultMargin,
    backgroundColor: Colors.listBackgroundColor,
  },
  listItem: {
    ...listItemShared,
    marginHorizontal: 5,
  },
  androidListItem: {
    ...listItemShared,
    marginHorizontal: defaultMargin,
  },
  listImage: {
    height: listItemImageSize,
    width: listItemImageSize,
  },
  listImageNumberView: {
    position: "absolute",
    top: 5,
    left: 5,
    height: 26,
    width: 26,
    backgroundColor: Colors.white,
    borderRadius: 13,
  },
  listImageNumberText: StyleSheetUtils.flatten([
    TextStyles.body, {
      color: Colors.black,
      marginTop: 1,
      fontSize: 18,
      letterSpacing: -2.0,
      left: ios ? -1 : 0,
      fontWeight: "500",
      textAlign: "center",
      backgroundColor: "transparent",
    },
  ]),
  listItemTextContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: textMargin,
  },
  guideNumberText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      color: Colors.purple,
    },
  ]),
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body, {
      color: Colors.black,
      marginTop: 8,
      flexWrap: "wrap",
      fontSize: 20,
      fontWeight: "500",
      lineHeight: 23.0,
      letterSpacing: 0.1,
      marginRight: textMargin,
    },
  ]),
  listItemAddress: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      marginTop: 4,
      lineHeight: 21,
      marginRight: textMargin,
      color: Colors.warmGrey,
    },
  ]),
  numberedMarkerText: StyleSheetUtils.flatten([
    TextStyles.body, {
      position: "absolute",
      width: markerImageInactiveWidth,
      top: 2,
      left: ios ? -1 : -2,
      fontSize: 18,
      letterSpacing: -2.0,
      fontWeight: "500",
      lineHeight: 23.0,
      textAlign: "center",
      color: Colors.white,
    },
  ]),
  numberedMarkerTextActive: StyleSheetUtils.flatten([
    TextStyles.body, {
      position: "absolute",
      width: markerImageActiveWidth,
      top: ios ? 9 : 5,
      left: ios ? -1 : -3,
      fontSize: 18,
      letterSpacing: -2.0,
      fontWeight: "500",
      lineHeight: 23.0,
      textAlign: "center",
      color: Colors.black,
    },
  ]),
});

export default class MapWithListView extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  static createMapItemsFromNavItems(navItems) {
    const items = [];
    navItems.forEach((item) => {
      const { contentType } = item;
      const { longitude, latitude, street_address } = item._embedded.location[0];
      let title;
      let imageUrl;
      let thumbnailUrl;
      let marker;
      switch (contentType) {
        case "location":
          title = item.name;
          imageUrl = item.apperance.image.sizes.medium;
          thumbnailUrl = item.apperance.image.sizes.thumbnail;
          marker = locationMarkerInactive;
          break;
        case "trail":
        case "guide":
          title = item.title.plain_text;
          imageUrl = item.guide_images[0].sizes.medium;
          thumbnailUrl = item.guide_images[0].sizes.thumbnail;
          marker = trailMarkerInactive;
          break;
        default:
      }
      const newItem = ({
        id: item.id.toString(),
        location: { longitude: Number(longitude), latitude: Number(latitude) },
        title,
        imageUrl,
        thumbnailUrl,
        streetAdress: street_address,
        markerIcon: marker,
        contentType,
        contentObject: item,
      });
      items.push(newItem);
    });
    return items;
  }

  static createItemsFromTrail(trail, screen = "") {
    const { subAttractions, contentObjects, contentType } = trail;
    const embeddedLocations = trail._embedded.location;
    const trailObjects = [];

    subAttractions.forEach((item) => {
      const objectId = item.content[0];
      const locationId = item.location;

      const contentObject = contentObjects[objectId];
      const locationObject = embeddedLocations.find(location => location.id === locationId);
      const { longitude, latitude } = locationObject;

      trailObjects.push({
        id: objectId,
        location: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
        title: contentObject.title,
        imageUrl: contentObject.image[0].sizes.medium,
        thumbnailUrl: contentObject.image[0].sizes.thumbnail,
        streetAdress: locationObject.street_address,
        markerIcon: numberedMarkerInactive,
        order: contentObject.order,
        labelDisplayNumber: 0,
        contentObject,
        imageType: (screen === "trailScreen") ? "trailScreen" : contentType,
      });
    });

    trailObjects.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));

    let index = 1;
    trailObjects.forEach((item) => {
      item.labelDisplayNumber = index;
      index += 1;
    });

    return trailObjects;
  }

  constructor(props) {
    super(props);

    const { items } = this.props;
    this.state = {
      isInitialized: false,
      activeMarker: items[0],
      markersFocused: false,
    };
  }

  componentWillReceiveProps({ items }) {
    if (!this.state.isInitialized) {
      this.setState({ isInitialized: true, activeMarker: items[0] });
    }
  }

  focusMarkers(markers) {
    if (!markers) return;

    const padding = 50;
    const edgePadding = {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
    const options = {
      edgePadding,
      animated: false,
    };
    this.map.fitToCoordinates(markers.map(marker => marker.location), options);
  }

  scrollToIndex = (index) => {
    if (!this.listRef) return;

    if (ios) {
      const x = ((listItemWidth + (defaultMargin / 2)) * index) - 15;
      this.listRef.scrollToOffset({ offset: x });
    } else {
      this.listRef.setPage(index);
      this.panMapToIndex(index);
    }
  }

  scrollToListItemWithId = (marker) => {
    const { items } = this.props;
    const index = items.findIndex(item => item === marker);
    this.scrollToIndex(index);
  }

  panMapToIndex = (index) => {
    const { items } = this.props;
    const marker = items[index];
    const { activeMarker } = this.state;

    if (marker !== activeMarker) {
      this.setState({ activeMarker: marker });
      this.map.animateToCoordinate(marker.location);
    }
  }
  /**
   * CALLBACK FUNCTIONS
   */
  onMapReady = () => {
    const { items } = this.props;
    const { markersFocused } = this.state;
    if (items.length > 0 && !markersFocused) {
      this.focusMarkers(items);
      this.setState({ markersFocused: true });
    }
  }

  onListScroll = (e) => {
    const xOffset = e.nativeEvent.contentOffset.x;
    const fullItemWidth = listItemWidth + (defaultMargin / 2);

    const index = Math.round(Math.abs(xOffset / fullItemWidth));
    this.panMapToIndex(index);
  }

  onPageScroll = ({ nativeEvent }) => {
    // This is called far too often. Moved the call to panMapToIndex() to scrollToIndex().
    /*
    const { position, offset } = nativeEvent;
    const index = offset < 0.5 ? position : position + 1;
    this.panMapToIndex(index);
    */
  }

  onPageSelected = ({ nativeEvent }) => {
    const { position } = nativeEvent;
    this.panMapToIndex(position);
  }

  getItemLayout = (data, index) => (
    { length: listItemWidth, offset: (listItemWidth + (defaultMargin / 2)) * index, index }
  );

  onListItemPressed = (listItem) => {
    const { navigate } = this.props.navigation;
    const { contentType, contentObject } = listItem;
    switch (contentType) {
      case "location":
      {
        AnalyticsUtils.logEvent("view_location", { name: contentObject.slug });
        navigate("LocationDetailsScreen", { location: contentObject });
        break;
      }
      case "trail":
      {
        const trail = contentObject;
        const title = trail.guidegroup[0].name;
        AnalyticsUtils.logEvent("view_guide", { name: trail.slug });
        navigate("TrailScreen", { trail, title });
        return;
      }
      case "guide":
      {
        const guide = contentObject;
        const title = guide.guidegroup[0].name;
        AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
        navigate("GuideDetailsScreen", { id: guide.id, title });
        return;
      }
      default:
      {
        const { title } = contentObject;
        const stopAudioOnUnmount = this.props.stopAudioOnUnmount === true;
        AnalyticsUtils.logEvent("view_object", { name: title });
        navigate("ObjectDetailsScreen", { title, contentObject, stopAudioOnUnmount });
      }
    }
  }

  onMarkerPressed = (marker) => {
    this.scrollToListItemWithId(marker);
  }

  onListItemDirectionsButtonPressed = (listItem) => {
    const { location } = listItem;
    const { latitude, longitude } = location;
    const directionsUrl = LocationUtils.directionsUrl(latitude, longitude, this.state.geolocation);
    UrlUtils.openUrlIfValid(directionsUrl);
  }

  markerImageForTrailObject(trailObject) {
    const { activeMarker } = this.state;
    const { imageType, contentType } = trailObject;
    let image;

    if (imageType === "trail" || contentType === "trail") {
      image = (activeMarker.id === trailObject.id) ? trailMarkerActive : trailMarkerInactive;
    } else if (imageType === "trailScreen") {
      image = (activeMarker.id === trailObject.id) ? numberedMarkerActive : numberedMarkerInactive;
    } else {
      image = (activeMarker.id === trailObject.id) ? locationMarkerActive : locationMarkerInactive;
    }
    return image;
  }

  /**
   * RENDER FUNCTIONS
   */

  numberedMapViewMarker = (trailObject) => {
    const { id, location } = trailObject;
    const { activeMarker } = this.state;

    const image = trailObject.markerIcon;
    const numberString = trailObject.labelDisplayNumber;

    return (
      <MapView.Marker
        key={id}
        coordinate={location}
        identifier={id}
        onPress={() => this.onMarkerPressed(trailObject)}
        anchor={{ x: 0.5, y: 1 }}
        centerOffset={{ x: 0.5, y: 1 }}
        image={image}
      >
        <Text style={styles.numberedMarkerText}>{numberString}</Text>
      </MapView.Marker>
    );
  }

  defaultMapViewMarker = (trailObject) => {
    const { id, location } = trailObject;
    const image = trailObject.markerIcon;

    return (
      <MapView.Marker
        key={id}
        coordinate={location}
        identifier={id}
        onPress={() => this.onMarkerPressed(trailObject)}
        image={image}
        zIndex={id}
      />
    );
  }

  renderMapMarkers() {
    const { items } = this.props;

    return items.map((trailObject) => {
      if (trailObject.imageType === "trailScreen") {
        return this.numberedMapViewMarker(trailObject);
      }
      return this.defaultMapViewMarker(trailObject);
    });
  }

  renderActiveMarker() {
    const { items } = this.props;
    const { activeMarker } = this.state;
    let activeLocation = { latitude: 56.0471881, longitude: 12.6963658 };
    let marker = locationMarkerActive;

    for (let i = 0; i < items.length; i += 1) {
      if (items[i].id === activeMarker.id) {
        activeLocation = items[i].location;
        if (items[i].imageType === "trailScreen") { marker = numberedMarkerActive; } else if (items[i].imageType === "trail" || items[i].contentType === "trail") { marker = trailMarkerActive; }
      }
    }
    return (
      <MapView.Marker
        coordinate={activeLocation}
        image={marker}
        zIndex={1000}
      >
        <Text style={styles.numberedMarkerTextActive}>{activeMarker.labelDisplayNumber}</Text>
      </MapView.Marker>
    );
  }

  displayGuideNumber = (numberOfGuides, type) => {
    if (!numberOfGuides || !type) return null;
    let textString;
    const plural = numberOfGuides > 1;

    const locationString = plural ? LangService.strings.LOCATIONS : LangService.strings.LOCATION;
    const mediaGuideString = plural ? LangService.strings.MEDIAGUIDES : LangService.strings.MEDIAGUIDE;

    if (type === "location") {
      textString = `${numberOfGuides} ${mediaGuideString.toLowerCase()}`;
    } else if (type === "trail") {
      textString = `${LangService.strings.TOUR} ${LangService.strings.WITH} ${numberOfGuides} ${locationString}`;
    } else if (type === "guide") {
      textString = `${LangService.strings.MEDIAGUIDE} ${LangService.strings.WITH} ${numberOfGuides} ${LangService.strings.OBJECT}`;
    }

    return (
      <Text style={styles.guideNumberText}>{textString}</Text>
    );
  }

  displayNumberView = (item) => {
    const trailScreen = item.imageType === "trailScreen";
    if (!trailScreen) return null;

    const numberString = item.labelDisplayNumber;
    const numberView = (
      <View style={styles.listImageNumberView}>
        <Text style={styles.listImageNumberText}>{numberString}</Text>
      </View>
    );

    return numberView;
  }

  renderListItem = (item, listItemStyle) => {
    const { thumbnailUrl, streetAdress, title } = item;
    const trailScreen = item.imageType === "trailScreen";
    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(item)}>
        <View style={listItemStyle}>
          {thumbnailUrl && <Image style={styles.listImage} source={{ uri: thumbnailUrl }} />}
          {this.displayNumberView(item)}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.listItemAddress} numberOfLines={1}>{streetAdress}</Text>
            {!trailScreen
              ? null
              : <IconTextTouchable
                iconName="directions"
                text={LangService.strings.DIRECTIONS}
                onPress={() => this.onListItemDirectionsButtonPressed(item)}
              />}
            {this.displayGuideNumber(item.contentObject.numberOfGuides, item.contentType)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderItem = listItem => (
    this.renderListItem(listItem.item, styles.listItem)
  );

  androidRenderItem = (item, index) => (
    <View key={index}>
      {this.renderListItem(item, styles.androidListItem)}
    </View>
  );

  renderHorizontalList(items) {
    if (ios) {
      return (
        <FlatList
          contentInset={{ left: 10, top: 0, bottom: 0, right: 10 }}
          data={items}
          horizontal
          keyExtractor={item => item.id}
          ref={(ref) => { this.listRef = ref; }}
          renderItem={item => this.renderItem(item)}
          style={styles.listStyle}
          getItemLayout={this.getItemLayout}
          onScroll={this.onListScroll}
          snapToAlignment="center"
          snapToInterval={listItemWidth + 10}
          decelerationRate="fast"
          scrollEventThrottle={300}
        />
      );
    }
    return (
      <ViewPagerAndroid
        ref={(ref) => { this.listRef = ref; }}
        onPageSelected={this.onPageSelected}
        onPageScroll={this.onPageScroll}
        peekEnabled
        pageMargin={-30}
        style={styles.listStyle}
        initialPage={0}
      >
        {items.map((element, index) => this.androidRenderItem(element, index))}
      </ViewPagerAndroid>
    );
  }

  render() {
    const { items, initialLocation = { latitude: 56.0471881, longitude: 12.6963658 } } = this.props;
    const { longitude, latitude } = initialLocation;
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          showsUserLocation
          onMapReady={this.onMapReady}
          initialRegion={
            {
              latitude,
              longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.06,
            }
          }
        >
          {this.renderMapMarkers()}
          {this.renderActiveMarker()}
        </MapView>
        {this.renderHorizontalList(items)}
      </View>
    );
  }
}
