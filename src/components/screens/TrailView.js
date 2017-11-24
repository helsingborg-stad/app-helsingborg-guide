import React, {
  Component,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Linking,
  Platform,
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
import * as _ from "lodash";
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

const defaultMargin = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    height: 350,
  },
  flatList: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    marginHorizontal: defaultMargin,
    marginTop: 4,
  },
  listImage: {
    height: 75,
    width: 75,
  },
  listItemTextContainer: {
    flexDirection: "column",
    marginLeft: defaultMargin,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 13,
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
    // console.log(subLocation._embedded.location);
    // console.log(subLocation);

    if (!subLocation._embedded.location) return [];

    return subLocation._embedded.location.map((item) => {
      const marker = {
        location: {
          latitude: null,
          longitude: null,
        },
        itemId: item.id,
      };
      marker.location.latitude = parseFloat(item.latitude);
      marker.location.longitude = parseFloat(item.longitude);
      return marker;
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      subLocation: this.props.subLocations[0],
      markers: TrailView.markersFromLocation(this.props.subLocations[0]),
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

  renderMapMarkers() {
    return this.state.markers.map((marker) => {
      if (!marker.location.latitude || !marker.location.latitude) return null;
      const image = markerImageActive;
      return (
        <MapView.Marker
          key={marker.itemId}
          coordinate={marker.location}
          image={image}
          identifier={`${marker.itemId}`}
        />
      );
    });
  }

  renderRow = (contentObject) => {
    const { title, latitude, longitude, street_address } = contentObject.item;
    const images = _.values(this.state.subLocation.contentObjects);
    const imageUrl = images[contentObject.index - 1] && images[contentObject.index - 1].image[0].sizes.thumbnail;
    console.log(imageUrl);

    return (
      <View style={styles.listItem}>
        {imageUrl && <Image style={styles.listImage} source={{ uri: imageUrl }} />}
        <View style={styles.listItemTextContainer}>
          <Text style={styles.listItemTitle}>{title.plain_text}</Text>
          <Text style={styles.listItemTitle}> {street_address} </Text>
          <Text style={styles.listItemTitle}>Lat: {latitude} · Long: {longitude} </Text>
        </View>
      </View>
    );
  }

  render() {
    const { location } = this.state.subLocation._embedded;
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          showsUserLocation
          initialRegion={
            {
              latitude: 56.04765769999999,
              longitude: 12.6888389,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          }
        >
          {this.renderMapMarkers()}
        </MapView>
        <FlatList
          style={styles.flatList}
          data={location}
          renderItem={this.renderRow}
          keyExtractor={item => `i${item.id}`}
        />
      </View>
    );
  }
}


function getFilteredSubLocations(list, parentId) {
  if (!list || !list.length) return [];
  const filtered = _.filter(list, item => item.guidegroup[0].id === parentId);
  return _.sortBy(filtered, item => item.title.plain_text);
}

function mapStateToProps(state, ownProps) {
  const {
    guide,
  } = ownProps.navigation.state.params;
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
