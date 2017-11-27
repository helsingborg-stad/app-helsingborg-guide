import React, {
  Component,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
import * as internetActions from "../../actions/internetActions";
import * as subLocationActions from "../../actions/subLoactionActions";
import {
  Colors,
  TabBarStyles,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";

const markerImageActive = require("../../images/marker-active.png");
const markerImageInactive = require("../../images/marker-inactive.png");

const defaultMargin = 20;
const listItemImageSize = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    flex: 2,
  },
  flatList: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    marginTop: defaultMargin,
    marginHorizontal: defaultMargin,
    marginBottom: 0,
  },
  listImage: {
    height: listItemImageSize,
    width: listItemImageSize,
  },
  listItemTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: defaultMargin,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 15,
      marginRight: defaultMargin,
    },
  ]),
});

class TrailView extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    subLocations: PropTypes.array.isRequired,
    internet: PropTypes.bool.isRequired,
    geolocation: PropTypes.any.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { guide } = navigation.state.params;
    const name = guide ? guide.name : undefined;
    return {
      title: name,
      ...TabBarStyles.guide,
    };
  };

  static markersFromLocation(subLocation) {
    if (!subLocation._embedded.location) return [];

    const subAttractions = subLocation.subAttractions.map(subAttractionItem => subAttractionItem.location);

    const markers = subLocation._embedded.location.map((item) => {
      if ((subAttractions.filter(sub => sub === item.id).length === 0)) { return null; }

      const marker = {
        location: {
          latitude: null,
          longitude: null,
        },
        locationId: item.id,
      };
      marker.location.latitude = parseFloat(item.latitude);
      marker.location.longitude = parseFloat(item.longitude);

      return marker;
    });

    // Remove null objects from markers (ie, is not a subAttraction location)
    const filteredMarkers = markers.filter(item => item !== null);
    return filteredMarkers;
  }

  static createTrailObjects(subAttractions) {
    return subAttractions.map((item) => {
      const trailObject = {
        objectId: item.content[0],
        locationId: item.location,
      };
      return trailObject;
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      geolocation: this.props.geolocation,
      subLocation: this.props.subLocations[0],
      trailObjects: TrailView.createTrailObjects(this.props.subLocations[0].subAttractions),
      markers: TrailView.markersFromLocation(this.props.subLocations[0]),
      activeMarker: {},
    };
  }

  componentDidMount() {
    if (this.state.markers.length) {
      setTimeout(() => {
        this.focusMarkers(this.state.markers);
      }, 1000);
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
      animated: true,
    };
    this.map.fitToCoordinates(markers.map(marker => marker.location), options);
  }

  onMarkerPressed = (marker) => {
    this.setState({ activeMarker: marker.locationId });
    this.scrollToListItemWithId(marker);
  }

  scrollToListItemWithId = (marker) => {
    const index = this.state.trailObjects.findIndex(item => item.locationId === marker.locationId);
    this.listRef.scrollToIndex({ animated: true, index });
  }

  onListItemPressed = (listItem) => {
    const { navigate } = this.props.navigation;
    const contentObject = this.contentObjectFromId(listItem.item.objectId);
    const { title } = contentObject;
    navigate("ObjectView", { title, contentObject });
  }

  locationItemFromId = (locationId) => {
    const { _embedded } = this.state.subLocation;
    const locationItem = _embedded.location.filter(item => item.id === locationId);
    return locationItem[0];
  }

  contentObjectFromId = (objectId) => {
    const { contentObjects } = this.state.subLocation;
    const contentObject = contentObjects[objectId];
    return contentObject;
  }

  renderMapMarkers() {
    const { activeMarker } = this.state;

    return this.state.markers.map((marker) => {
      const image = marker.locationId === activeMarker ? markerImageActive : markerImageInactive;
      return (
        <MapView.Marker
          key={`${marker.locationId}`}
          coordinate={marker.location}
          image={image}
          identifier={`${marker.locationId}`}
          onPress={() => this.onMarkerPressed(marker)}
        />
      );
    });
  }

  renderRow = (listItem) => {
    const { objectId, locationId } = listItem.item;
    const contentObject = this.contentObjectFromId(objectId);
    const locationItem = this.locationItemFromId(locationId);

    const imageUrl = contentObject.image[0].sizes.medium;
    const { street_address } = locationItem;
    const { id, title } = contentObject;

    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(listItem)}>
        <View style={styles.listItem}>
          {imageUrl && <Image style={styles.listImage} source={{ uri: imageUrl }} />}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle}>{id}</Text>
            <Text style={styles.listItemTitle}>{title}</Text>
            <Text style={styles.listItemTitle}>{street_address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { trailObjects } = this.state;
    const locationItem = this.locationItemFromId(trailObjects[0].locationId);
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          showsUserLocation
          initialRegion={
            {
              latitude: parseFloat(locationItem.latitude),
              longitude: parseFloat(locationItem.longitude),
              latitudeDelta: 0.09,
              longitudeDelta: 0.06,
            }
          }
        >
          {this.renderMapMarkers()}
        </MapView>
        <FlatList
          ref={(ref) => { this.listRef = ref; }}
          style={styles.flatList}
          data={trailObjects}
          renderItem={this.renderRow}
          keyExtractor={item => `i${item.locationId}-${item.objectId}`}
        />
      </View>
    );
  }
}

function getFilteredSubLocations(list, parentId) {
  if (!list || !list.length) return [];
  const filtered = list.filter(item => item.guidegroup[0].id === parentId);
  return filtered.sort((a, b) => a.title.plain_text > b.title.plain_text);
}

function mapStateToProps(state, ownProps) {
  const { guide } = ownProps.navigation.state.params;
  return {
    subLocations: getFilteredSubLocations(state.subLocations, guide.id) || [],
    internet: state.internet.connected,
    geolocation: state.geolocation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailView);
