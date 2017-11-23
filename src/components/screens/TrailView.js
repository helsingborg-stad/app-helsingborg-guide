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
    marginHorizontal: defaultMargin,
    marginTop: 4,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 8,
    }],
  ),
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

    makeMarkersFromLocation(subLocation) {
      console.log(subLocation._embedded.location);

      if (!subLocation._embedded.location) return [];

      return subLocation._embedded.location.map((item) => {
        const marker = { location: { latitude: null, longitude: null }, itemId: item.id };
        marker.location.latitude = parseFloat(item.latitude);
        marker.location.longitude = parseFloat(item.longitude);
        return marker;
      });
    }

    constructor(props) {
      super(props);
      this.state = {
        subLocation: this.props.subLocations[0],
        markers: this.makeMarkersFromLocation(this.props.subLocations[0]),
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
      const options = { edgePadding, animated: true };
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
      return (
          <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>{contentObject.index} - {title.plain_text} - {street_address}</Text>
              <Text style={styles.listItemTitle}>Lat: {latitude} · Long: {longitude}</Text>
            </View>
      );
    }

    render() {
      const { location } = this.state.subLocation._embedded;

      // console.log(this.state.markers);
      return (
          <View style={styles.container}>
              <MapView
                  ref={(ref) => {
                        this.map = ref;
                    }}
                  style={styles.map}
                  showsUserLocation
                  initialRegion={{
                        latitude: 56.04765769999999,
                        longitude: 12.6888389,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
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
