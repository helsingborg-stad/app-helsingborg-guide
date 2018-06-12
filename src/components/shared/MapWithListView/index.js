// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
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
  PixelRatio,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Colors, TextStyles } from "../../../styles/";
import {
  AnalyticsUtils,
  StyleSheetUtils,
  LocationUtils,
  UrlUtils,
} from "../../../utils/";
import LangService from "../../../services/langService";
import IconTextTouchable from "./../IconTextTouchable";
import ViewPagerAndroidContainer from "../../shared/ViewPagerAndroidContainer";

import { selectCurrentContentObject } from "../../../actions/uiStateActions";

const ios = Platform.OS === "ios";

const defaultMargin = 20;
const textMargin = 10;
const listItemImageSize = 120;

// Marker image
const markerImageActiveWidth = 42;
const markerImageInactiveWidth = 32;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const listItemWidth = screenWidth - defaultMargin * 2;

const locationMarkerActive = require("../../../images/map/marker-location-active.png");
const locationMarkerInactive = require("../../../images/map/marker-location.png");

const trailMarkerActive = require("../../../images/map/marker-trail-active.png");
const trailMarkerInactive = require("../../../images/map/marker-trail.png");

const numberedMarkerActive = require("../../../images/map/marker-number-active.png");
const numberedMarkerInactive = require("../../../images/map/marker-number.png");

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
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.listBackgroundColor,
  },
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
    TextStyles.body,
    {
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
    TextStyles.body,
    {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      color: Colors.purple,
    },
  ]),
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body,
    {
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
    TextStyles.body,
    {
      fontSize: 16,
      marginTop: 4,
      lineHeight: 21,
      marginRight: textMargin,
      color: Colors.warmGrey,
    },
  ]),
  numberedMarkerText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      position: "absolute",
      width: markerImageInactiveWidth,
      top: ios ? 6 : 3,
      left: ios ? -1 : -2,
      fontSize: ios ? 18 : 16,
      letterSpacing: -2.0,
      fontWeight: "500",
      lineHeight: 23.0,
      textAlign: "center",
      color: Colors.white,
    },
  ]),
  numberedMarkerTextActive: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      position: "absolute",
      width: markerImageActiveWidth,
      top: ios ? 9 : 7,
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

export type MapItem = {
  guide?: Guide,
  guideGroup?: GuideGroup,
  contentObject?: ContentObject,
}

type Props = {
  id: number,
  items: MapItem[],
  navigation: any,
  initialLocation?: Location,
  showNumberedMapMarkers?: boolean,
  showDirections?: boolean,
  userLocation: ?GeolocationType,
  dispatchSelectContentObject(obj: ContentObject): void
}

type State = {
  isInitialized: boolean,
  activeMarker: MapItem,
  markersFocused: boolean,
  recentlyTappedPin: boolean,
};

function getIdFromMapItem(item: MapItem): string {
  if (item.contentObject) { return item.contentObject.id; }
  if (item.guide) { return `${item.guide.id}`; }
  if (item.guideGroup) { return `${item.guideGroup.id}`; }

  return "";
}

function getLocationFromItem(item: MapItem): ?Location {
  const { contentObject, guide, guideGroup } = item;

  if (guide) { return guide.location; }
  if (guideGroup) { return guideGroup.location; }
  if (contentObject) { return contentObject.location; }

  return null;
}

function getLocations(items: MapItem[]): Location[] {
  const locs: Location[] = [];
  items.forEach((i) => {
    const l = getLocationFromItem(i);
    if (l) {
      locs.push(l);
    }
  });
  return locs;
}

class MapWithListView extends Component<Props, State> {
  static createMapItemsFromNavItems(navItems) {
    const items = [];
    navItems.forEach((item) => {
      const { contentType } = item;
      const {
        longitude,
        latitude,
        street_address,
      } = item._embedded.location[0];
      let title;
      let imageUrl;
      let thumbnailUrl;
      switch (contentType) {
        case "location":
          title = item.name;
          imageUrl = item.apperance.image.sizes.medium;
          thumbnailUrl = item.apperance.image.sizes.thumbnail;
          break;
        case "trail":
        case "guide":
          title = item.title.plain_text;
          imageUrl = item.guide_images[0].sizes.medium;
          thumbnailUrl = item.guide_images[0].sizes.thumbnail;
          break;
        default:
      }
      const newItem = {
        id: item.id.toString(),
        location: { longitude: Number(longitude), latitude: Number(latitude) },
        title,
        imageUrl,
        thumbnailUrl,
        streetAdress: street_address,
        contentType,
        contentObject: item,
        labelDisplayNumber: 0,
      };
      items.push(newItem);
    });

    // labelDisplayNumber is not displayed on this type of map, but is still added as the zIndex of the map markers are based on index. This is to counter "flickering" markers.
    let index = 1;
    items.forEach((item) => {
      item.labelDisplayNumber = index;
      index += 1;
    });

    return items;
  }
  /** Phase out */
  static createItemsFromTrail(trail, screen = "") {
    const { contentObjects, guideType } = trail;
    // const embeddedLocations = trail._embedded.location;
    const trailObjects = [];

    contentObjects.forEach((item) => {
      const objectId = item.id;

      trailObjects.push({
        id: objectId,
        location: item.location
          ? {
            longitude: parseFloat(item.location.longitude),
            latitude: parseFloat(item.location.latitude),
          }
          : null,
        title: item.title,
        imageUrl: item.images[0].medium,
        thumbnailUrl: item.images[0].thumbnail,
        streetAdress: item.location ? item.location.streetAddress : null,
        order: item.order,
        labelDisplayNumber: 0,
        item,
        imageType: screen === "TrailScreen" ? "TrailScreen" : guideType,
      });
    });

    trailObjects.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));

    // labelDisplayNumber is set to index value, as it's the easiest way to pass the information. This replaces using trailObject.order as label, as we can't trust the backend.
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
      recentlyTappedPin: false,
    };
  }

  componentWillReceiveProps({ items }) {
    if (!this.state.isInitialized) {
      this.setState({ isInitialized: true, activeMarker: items[0] });
    }
  }

  map: ?MapView;
  listRef: ?FlatList<any> | ?ViewPagerAndroid;

  focusMarkers(markers: MapItem[]) {
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
    const locations: Location[] = getLocations(markers);
    if (this.map) { this.map.fitToCoordinates(locations, options); }
  }

  scrollToIndex = (index) => {
    if (!this.listRef) return;

    if (ios) {
      const x = (listItemWidth + defaultMargin / 2) * index - 15;
      this.listRef.scrollToOffset({ offset: x });
    } else {
      this.listRef.setPage(index);
    }
  };

  panMapToIndex = (index: number) => {
    const { items } = this.props;
    const marker = items[index];
    const { activeMarker } = this.state;

    if (marker !== activeMarker) {
      this.setState({ activeMarker: marker });
      const location = getLocationFromItem(marker);
      if (this.map && location) { this.map.animateToCoordinate(location); }
    }
  };
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
  };

  // iOS callback event when the list is changed
  onListScroll = (e) => {
    const { recentlyTappedPin } = this.state;
    if (!recentlyTappedPin) {
      const xOffset = e.nativeEvent.contentOffset.x;
      const fullItemWidth = listItemWidth + defaultMargin / 2;
      const index = Math.round(Math.abs(xOffset / fullItemWidth));
      this.panMapToIndex(index);
    }
  };

  // Android callback event when the list is changed
  onPageSelected = ({ nativeEvent }) => {
    const { recentlyTappedPin } = this.state;
    if (!recentlyTappedPin) {
      const { position } = nativeEvent;
      this.panMapToIndex(position);
    }
  };

  // Determine layout of list cards on Android
  getItemLayout = (data, index) => ({
    length: listItemWidth,
    offset: (listItemWidth + defaultMargin / 2) * index,
    index,
  });

  onListItemPressed = (listItem: MapItem) => {
    const { navigate } = this.props.navigation;
    const { contentType, contentObject } = listItem;
    switch (contentType) {
      case "location": {
        AnalyticsUtils.logEvent("view_location", { name: contentObject.slug });
        navigate("LocationScreen", { location: contentObject });
        break;
      }
      case "trail": {
        const trail = contentObject;
        const title = trail.guidegroup[0].name;
        AnalyticsUtils.logEvent("view_guide", { name: trail.slug });
        navigate("OldTrailScreen", { trail, id: trail.id, title });
        return;
      }
      case "guide": {
        const guide = contentObject;
        const title = guide.guidegroup[0].name;
        AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
        navigate("GuideDetailsScreen", { id: guide.id, title });
        return;
      }
      default: {
        const { contentObject: item } = listItem;
        if (item) {
          this.props.dispatchSelectContentObject(item);

          AnalyticsUtils.logEvent("view_object", { name: item.title });
          navigate("ObjectScreen", {
            title: item.title,
          });
        }
      }
    }
  };

  // When a map marker is pressed on either OS
  onMarkerPressed = (marker) => {
    const { items } = this.props;
    const index = items.findIndex(item => item === marker);
    this.setState({ recentlyTappedPin: true });
    this.scrollToIndex(index);
    this.panMapToIndex(index);
    // Setting a timeout to prevent map from "jumping" while panning
    setTimeout(() => {
      this.setState({ recentlyTappedPin: false });
    }, 500);
  };

  onListItemDirectionsButtonPressed = (item: MapItem) => {
    const location = getLocationFromItem(item);
    if (!location) return;

    const { userLocation } = this.props;
    const { latitude, longitude } = location;
    const directionsUrl = LocationUtils.directionsUrl(
      latitude,
      longitude,
      userLocation,
    );
    UrlUtils.openUrlIfValid(
      directionsUrl,
      LangService.strings.OPEN_IN_MAPS,
      "",
      LangService.strings.CANCEL,
      LangService.strings.OPEN,
    );
  };

  markerImageForTrailObject(trailObject) {
    const { activeMarker } = this.state;
    const { imageType, contentType } = trailObject;
    let image;

    if (imageType === "trail" || contentType === "trail") {
      image =
        activeMarker.id === trailObject.id
          ? trailMarkerActive
          : trailMarkerInactive;
    } else if (imageType === "TrailScreen") {
      image =
        activeMarker.id === trailObject.id
          ? numberedMarkerActive
          : numberedMarkerInactive;
    } else {
      image =
        activeMarker.id === trailObject.id
          ? locationMarkerActive
          : locationMarkerInactive;
    }
    return image;
  }

  /**
   * RENDER FUNCTIONS
   */

  numberedMapViewMarker = (mapItem: MapItem, index: number) => {
    const id = getIdFromMapItem(mapItem);
    const location: ?Location = getLocationFromItem(mapItem);

    const { activeMarker } = this.state;
    const markerImage = this.markerImageForTrailObject(mapItem);
    const numberString: string = `${index}`;
    const active = getIdFromMapItem(activeMarker) === id;
    // Warning: zIndex is bugged on iOS 11!
    // Bug causes map markers to ignore zIndex when zIndex is changed by any means other than actually tapping the marker. (i.e. when changing by swiping the list)
    // AIRMapMarker has been edited to prioritize any marker with an zIndex of exactly 999 over any other marker.
    // This is why the active marker ALWAYS should have a zIndex of 999 until this issue is fixed.
    const zIndex = active ? 999 : index;

    return (
      <Marker
        key={id}
        coordinate={location}
        identifier={id}
        image={markerImage}
        onPress={!active ? () => this.onMarkerPressed(mapItem) : null}
        anchor={{ x: 0.5, y: 1 }}
        centerOffset={{ x: 0.5, y: 1 }}
        zIndex={zIndex}
      >
        <Text
          allowFontScaling={false}
          style={
            active ? styles.numberedMarkerTextActive : styles.numberedMarkerText
          }
        >
          {numberString}
        </Text>
      </Marker>
    );
  };

  defaultMapViewMarker = (trailObject) => {
    const { id, location } = trailObject;
    const { activeMarker } = this.state;
    const markerImage = this.markerImageForTrailObject(trailObject);
    const active = activeMarker.id === trailObject.id;
    // Warning: zIndex is bugged on iOS 11!
    // Bug causes map markers to ignore zIndex when zIndex is changed by any means other than actually tapping the marker. (i.e. when changing by swiping the list)
    // AIRMapMarker has been edited to prioritize any marker with an zIndex of exactly 999 over any other marker.
    // This is why the active marker ALWAYS should have a zIndex of 999 until this issue is fixed.
    const zIndex = active ? 999 : trailObject.labelDisplayNumber;
    return (
      <Marker
        key={id}
        coordinate={location}
        identifier={id}
        image={markerImage}
        onPress={!active ? () => this.onMarkerPressed(trailObject) : null}
        zIndex={zIndex}
      />
    );
  };

  renderMapMarkers(items: MapItem[]) {
    const { showNumberedMapMarkers } = this.props;
    return items.map((item, index) => {
      if (showNumberedMapMarkers) {
        return this.numberedMapViewMarker(item, index);
      }
      return this.defaultMapViewMarker(item);
    });
  }

  displayGuideNumber = (numberOfGuides, type) => {
    if (!numberOfGuides || !type) return null;
    let textString;
    const plural = numberOfGuides > 1;

    const locationString = plural
      ? LangService.strings.LOCATIONS
      : LangService.strings.LOCATION;
    const mediaGuideString = plural
      ? LangService.strings.MEDIAGUIDES
      : LangService.strings.MEDIAGUIDE;
    const isAccessibility = PixelRatio.getFontScale() > 1;

    if (type === "location") {
      textString = `${numberOfGuides} ${mediaGuideString.toLowerCase()}`;
    } else if (type === "trail") {
      if (isAccessibility) {
        textString = `${numberOfGuides} ${locationString}`;
      } else {
        textString = `${LangService.strings.TOUR} ${
          LangService.strings.WITH
          } ${numberOfGuides} ${locationString}`;
      }
    } else if (type === "guide") {
      if (isAccessibility) {
        textString = `${numberOfGuides} ${LangService.strings.OBJECT}`;
      } else {
        textString = `${LangService.strings.MEDIAGUIDE} ${
          LangService.strings.WITH
          } ${numberOfGuides} ${LangService.strings.OBJECT}`;
      }
    }

    return <Text style={styles.guideNumberText}>{textString}</Text>;
  };

  displayNumberView = (item) => {
    const TrailScreen = item.guideType === "trail";
    if (!TrailScreen) return null;

    const numberString = item.labelDisplayNumber;
    const numberView = (
      <View style={styles.listImageNumberView}>
        <Text style={styles.listImageNumberText}>{numberString}</Text>
      </View>
    );

    return numberView;
  };

  getMapItemProps = (item: MapItem): {
    title: ?string,
    streetAddress: ?string,
    thumbnailUrl: ?string,
  } => {
    // TODO extract from Guide and GuideGroup
    const { contentObject, guide, guideGroup } = item;
    let streetAddress = null;
    let thumbnailUrl = null;
    if (contentObject) {
      const { title, location, images } = contentObject;
      if (location) {
        ({ streetAddress } = location);
      }
      if (images.length > 0) {
        thumbnailUrl = images[0].thumbnail;
      }
      return {
        title,
        streetAddress,
        thumbnailUrl,
      };
    }

    return { title: null, streetAddress, thumbnailUrl };
  }

  renderListItem = (item: MapItem, listItemStyle: any) => {
    const { title, streetAddress, thumbnailUrl } = this.getMapItemProps(item);
    const { showDirections } = this.props;
    const titleLineCount =
      screenHeight > 600 && PixelRatio.getFontScale() === 1 ? 2 : 1;
    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(item)}>
        <View style={listItemStyle}>
          {thumbnailUrl && (
            <Image style={styles.listImage} source={{ uri: thumbnailUrl }} />
          )}
          {this.displayNumberView(item)}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={titleLineCount}>
              {title}
            </Text>
            <Text style={styles.listItemAddress} numberOfLines={1}>
              {streetAddress}
            </Text>
            {showDirections ? (
              <IconTextTouchable
                iconName="directions"
                text={LangService.strings.DIRECTIONS}
                onPress={() => this.onListItemDirectionsButtonPressed(item)}
              />
            ) : null}
            {/* this.displayGuideNumber(item.contentObject.numberOfGuides, item.contentType) */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  androidRenderItem = (item, index) => (
    <View key={index}>{this.renderListItem(item, styles.androidListItem)}</View>
  );

  renderHorizontalList(items: MapItem[]) {
    if (ios) {
      return (
        <FlatList
          contentInset={{ left: 10, top: 0, bottom: 0, right: 10 }}
          data={items}
          horizontal
          keyExtractor={getIdFromMapItem}
          ref={(ref) => {
            this.listRef = ref;
          }}
          renderItem={item => this.renderListItem(item.item, styles.listItem)}
          style={styles.listStyle}
          getItemLayout={this.getItemLayout}
          onScroll={this.onListScroll}
          snapToAlignment="center"
          snapToInterval={listItemWidth + 10}
          decelerationRate="fast"
          scrollEventThrottle={300}
          swipeEnabled
        />
      );
    }
    return (
      <ViewPagerAndroidContainer style={styles.listStyle}>
        <ViewPagerAndroid
          ref={(ref) => {
            this.listRef = ref;
          }}
          onPageSelected={this.onPageSelected}
          peekEnabled
          pageMargin={-30}
          style={styles.listStyle}
          initialPage={0}
        >
          {items.map((element, index) =>
            this.androidRenderItem(element, index),
          )}
        </ViewPagerAndroid>
      </ViewPagerAndroidContainer>
    );
  }

  render() {
    const {
      items,
      initialLocation = { latitude: 56.0471881, longitude: 12.6963658 },
    } = this.props;
    const { longitude, latitude } = initialLocation;
    return (
      <SafeAreaView
        style={styles.rootContainer}
      >
        <View style={styles.container}>
          <MapView
            ref={(ref) => {
              this.map = ref;
            }}
            style={styles.map}
            showsUserLocation
            onMapReady={this.onMapReady}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.06,
            }}
          >
            {this.renderMapMarkers(items)}
          </MapView>
          {this.renderHorizontalList(items)}
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { geolocation } = state;
  return {
    userLocation: geolocation,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: contentObject =>
      dispatch(selectCurrentContentObject(contentObject)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapWithListView);
