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

const ios = Platform.OS === "ios";

const defaultMargin = 20;
const listItemImageSize = 120;
const headerHeight = 65;
const markerImageSize = 40;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const listItemWidth = screenWidth - (defaultMargin * 2);
const mapHeight = screenHeight - listItemImageSize - headerHeight - defaultMargin;

const imageMarkerActive = require("../../images/marker-active.png");
const imageMarkerInactive = require("../../images/marker-inactive.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    height: mapHeight,
  },
  flatList: {
    height: listItemImageSize,
    backgroundColor: Colors.warmGrey,
  },
  listItem: {
    flexDirection: "row",
    width: listItemWidth,
    height: listItemImageSize,
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: Colors.white,
  },
  listImage: {
    height: listItemImageSize,
    width: listItemImageSize,
  },
  listItemTextContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: defaultMargin,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body, {
      flexWrap: "wrap",
      fontSize: 16,
      marginRight: defaultMargin,
    },
  ]),
  listItemAddress: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      marginRight: defaultMargin,
      color: Colors.warmGrey,
    },
  ]),
  markerImage: {
    width: markerImageSize,
    height: markerImageSize,
    borderRadius: markerImageSize / 2,
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  markerImageActive: {
    width: markerImageSize,
    height: markerImageSize,
    borderRadius: markerImageSize / 2,
    borderWidth: 2.5,
    borderColor: Colors.lightPink,
  },
  androidViewPager: {
    flex: 1,
    height: listItemImageSize,
    backgroundColor: Colors.warmGrey,
  },
  androidListItem: {
    backgroundColor: Colors.white,
    alignItems: "center",
    padding: 20,
  },
});

export default class MapWithListView extends Component {
  constructor(props) {
    super(props);

    this.state = { activeMarker: {} };
  }

  componentDidMount() {
    const { items } = this.props;
    if (items.length) {
      setTimeout(() => {
        this.focusMarkers(items);
      }, 1000);
    }
    this.scrollToIndex(0);
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
      animated: true,
    };
    this.map.fitToCoordinates(markers.map(marker => marker.location), options);
  }

  scrollToIndex = (index) => {
    if (!this.listRef) return;

    const x = ((listItemWidth + (defaultMargin / 2)) * index) - 15;
    this.listRef.scrollToOffset({ offset: x });
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

  onListScroll = (e) => {
    const xOffset = e.nativeEvent.contentOffset.x;
    const fullItemWidth = listItemWidth + (defaultMargin / 2);

    const index = Math.round(Math.abs(xOffset / fullItemWidth));
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
    const { contentObject } = listItem.item;
    const { title, id } = contentObject;
    AnalyticsUtils.logEvent("view_object", { id, name: title });
    navigate("ObjectDetailsScreen", { title, contentObject });
  }

  onMarkerPressed = (marker) => {
    this.scrollToListItemWithId(marker);
  }

  onListItemDirectionsButtonPressed = (listItem) => {
    const { location } = listItem.item;
    const { latitude, longitude } = location;
    const directionsUrl = LocationUtils.directionsUrl(latitude, longitude, this.state.geolocation);
    UrlUtils.openUrlIfValid(directionsUrl);
  }

  /**
   * RENDER FUNCTIONS
   */
  renderMapMarkers() {
    const { activeMarker } = this.state;
    const { items } = this.props;

    return items.map((trailObject) => {
      const { id, location } = trailObject;
      const image = activeMarker === trailObject ? imageMarkerActive : imageMarkerInactive;
      return (
        <MapView.Marker
          key={id}
          coordinate={location}
          identifier={id}
          onPress={() => this.onMarkerPressed(trailObject)}
          image={image}
        />
      );
    });
  }

  renderItem = (listItem) => {
    const { imageUrl, streetAdress, title } = listItem.item;

    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(listItem)}>
        <View style={styles.listItem}>
          {imageUrl && <Image style={styles.listImage} source={{ uri: imageUrl }} />}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.listItemAddress}>{streetAdress}</Text>
            <TouchableOpacity onPress={() => this.onListItemDirectionsButtonPressed(listItem)}>
              <Icon name="directions" size={20} color={Colors.lightGrey} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  androidRenderItem = (item, index) => (
    <View
      style={styles.androidListItem}
      key={index}
    >
      <TouchableOpacity >
        <Text>{item.title}</Text>
      </TouchableOpacity>
    </View>
  )

  renderHorizontalList(items) {
    if (ios) {
      return (
        <FlatList
          contentInset={{ left: 10, top: 0, bottom: 0, right: 10 }}
          data={items}
          horizontal
          keyExtractor={item => item.id}
          ref={(ref) => { this.listRef = ref; }}
          renderItem={item => this.renderItem(item.item)}
          style={styles.flatList}
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
        onPageSelected={this.onPageSelected}
        peekEnabled
        pageMargin={20}
        style={styles.androidViewPager}
        initialPage={0}
      >
        {items.map((element, index) => this.androidRenderItem(element, index))}
      </ViewPagerAndroid>
    );
  }

  render() {
    const { items, initialLocation } = this.props;
    const { longitude, latitude } = initialLocation;
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          showsUserLocation
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
