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
import Icon from "react-native-vector-icons/MaterialIcons";
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

const ios = Platform.OS === "ios";

const defaultMargin = 20;
const textMargin = 13;
const listItemImageSize = 120;

// Marker image
const markerImageActiveWidth = 42;
const markerImageInactiveWidth = 32;

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
  directionsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  listItemDirectionsText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      color: Colors.purple,
    },
  ]),
  numberedMarkerText: StyleSheetUtils.flatten([
    TextStyles.body, {
      position: "absolute",
      width: markerImageInactiveWidth,
      top: 6,
      left: ios ? -1 : 2,
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
      top: ios ? 9 : 12,
      left: ios ? -1 : 3,
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
      switch (contentType) {
        case "location":
          title = item.name;
          imageUrl = item.apperance.image.sizes.large;
          thumbnailUrl = item.apperance.image.sizes.thumbnail;
          break;
        case "trail":
        case "guide":
          title = item.title.plain_text;
          imageUrl = item.guide_images[0].sizes.large;
          thumbnailUrl = item.guide_images[0].sizes.thumbnail;
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
        contentObject,
        imageType: (screen === "trailScreen") ? "trailScreen" : contentType,
      });
    });
    return trailObjects;
  }

  constructor(props) {
    super(props);

    const { items } = this.props;
    this.state = {
      activeMarker: items[0],
      markersFocused: false,
    };
  }

  componentWillReceiveProps({ items }) {
    this.setState({ activeMarker: items[0] });
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
    const { position, offset } = nativeEvent;
    const index = offset < 0.5 ? position : position + 1;
    this.panMapToIndex(index);
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
        AnalyticsUtils.logEvent("view_location", { id: contentObject.id, name: contentObject.slug });
        navigate("LocationDetailsScreen", { location: contentObject });
        break;
      }
      case "trail":
      {
        const trail = contentObject;
        const title = trail.guidegroup[0].name;
        AnalyticsUtils.logEvent("view_guide", { id: trail.id, name: trail.slug });
        navigate("TrailScreen", { trail, title });
        return;
      }
      case "guide":
      {
        const guide = contentObject;
        const title = guide.guidegroup[0].name;
        AnalyticsUtils.logEvent("view_guide", { id: guide.id, name: guide.slug });
        navigate("GuideDetailsScreen", { id: guide.id, title });
        return;
      }
      default:
      {
        const { title, id } = contentObject;
        const isTrail = this.props.isTrail === true;
        AnalyticsUtils.logEvent("view_object", { id, name: title });
        navigate("ObjectDetailsScreen", { title, contentObject, isTrail });
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
      image = (activeMarker === trailObject) ? trailMarkerActive : trailMarkerInactive;
    } else if (imageType === "trailScreen") {
      image = (activeMarker === trailObject) ? numberedMarkerActive : numberedMarkerInactive;
    } else {
      image = (activeMarker === trailObject) ? locationMarkerActive : locationMarkerInactive;
    }
    return image;
  }

  /**
   * RENDER FUNCTIONS
   */

  numberedMapViewMarker = (trailObject) => {
    const { id, location } = trailObject;
    const { activeMarker } = this.state;

    const image = this.markerImageForTrailObject(trailObject);
    const numberString = trailObject.contentObject.order + 1;
    const active = activeMarker === trailObject;

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
        <Text style={active ? styles.numberedMarkerTextActive : styles.numberedMarkerText}>{numberString}</Text>
      </MapView.Marker>
    );
  }

  defaultMapViewMarker = (trailObject) => {
    const { id, location } = trailObject;
    const image = this.markerImageForTrailObject(trailObject);

    return (
      <MapView.Marker
        key={id}
        coordinate={location}
        identifier={id}
        onPress={() => this.onMarkerPressed(trailObject)}
        image={image}
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
      <Text style={styles.listItemDirectionsText}>{textString}</Text>
    );
  }

  displayDirections = (item) => {
    const trailScreen = item.imageType === "trailScreen";
    if (!trailScreen) return null;

    const directions = (
      <TouchableOpacity
        style={styles.directionsContainer}
        onPress={() => this.onListItemDirectionsButtonPressed(item)}
      >
        <Icon name="directions" size={24} color={Colors.purple} />
        <Text style={styles.listItemDirectionsText}>{LangService.strings.DIRECTIONS}</Text>
      </TouchableOpacity>
    );

    return directions;
  }

  displayNumberView = (item) => {
    const trailScreen = item.imageType === "trailScreen";
    if (!trailScreen) return null;

    const numberString = item.contentObject.order + 1;
    const numberView = (
      <View style={styles.listImageNumberView}>
        <Text style={styles.listImageNumberText}>{numberString}</Text>
      </View>
    );

    return numberView;
  }

  renderListItem = (item, listItemStyle) => {
    const { imageUrl, streetAdress, title } = item;
    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(item)}>
        <View style={listItemStyle}>
          {imageUrl && <Image style={styles.listImage} source={{ uri: imageUrl }} />}
          {this.displayNumberView(item)}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.listItemAddress} numberOfLines={1}>{streetAdress}</Text>
            {this.displayDirections(item)}
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
        </MapView>
        {this.renderHorizontalList(items)}
      </View>
    );
  }
}
