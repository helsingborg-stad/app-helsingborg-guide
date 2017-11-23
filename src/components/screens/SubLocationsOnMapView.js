import React, { Component } from "react";
import { Platform, View, Text, StyleSheet, Linking } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import Thumbnail from "../shared/thumbnail2";
import MapThumbnailsView from "../shared/MapThumbnailsView";
import RoundedBtn from "../shared/roundedBtn";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";

const styles = StyleSheet.create({
  thumbnailExtraContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 3,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  titleText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 13,
      fontWeight: "300",
    }],
  ),
  navigateBtnContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  navigateBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.lightPink,
  },
});

export default class SubLocationsOnMapView extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { name } = navigation.state.params;
    return {
      title: name,
      headerRight: null,
    };
  };

  static makeMarkersFromLocations(subLocations) {
    if (!subLocations || !subLocations.length) return [];
    return subLocations.map((item) => {
      const marker = { location: { latitude: null, longitude: null }, itemId: item.id };

      if (!item._embedded || !item._embedded.location.length) return marker;
      const location = item._embedded.location[0];
      marker.location.latitude = parseFloat(location.latitude);
      marker.location.longitude = parseFloat(location.longitude);
      return marker;
    });
  }

  static filterSubLocationsWithoutLocationObject(subLocations) {
    if (!subLocations || !subLocations.length) return [];
    return subLocations.filter((item) => {
      const { location } = item._embedded;
      return !(!item._embedded || !location.length || !location[0].id);
    });
  }

  static buildState(_subLocations) {
    const subLocations = SubLocationsOnMapView.filterSubLocationsWithoutLocationObject(_subLocations);

    return {
      subLocations,
      active: subLocations[0],
      markers: SubLocationsOnMapView.makeMarkersFromLocations(subLocations) || [],
    };
  }

  static openGoogleMapApp(lat, lng) {
    let url = `google.navigation:q=${lat},${lng}`;
    if (Platform.OS === "ios") url = `maps.apple.com/?ll=${lat},${lng}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        return null;
      })
      .catch(err => console.error("An error occurred", err));
  }

  constructor(props) {
    super(props);

    const { subLocations } = this.props.navigation.state.params;
    this.state = SubLocationsOnMapView.buildState(subLocations);
  }

  onItemPress(id) {
    const { navigate } = this.props.navigation;
    const { subLocations } = this.props.navigation.state.params;
    const { name } = subLocations[0].guidegroup[0];
    navigate("SubLocationView", {
      subLocationId: id,
      title: name,
    });
  }

  renderRow = (rowData) => {
    const location = rowData._embedded.location[0];

    return (
      <Thumbnail
        key={rowData.id}
        imageSource={{ uri: rowData.guide_images[0].sizes.medium_large }}
        title={rowData.title.plain_text}
        onPress={() => this.onItemPress(rowData.id)}
      >
        <View style={styles.thumbnailExtraContainer}>
          <View style={styles.navigateBtnContainer}>
            <RoundedBtn
              style={styles.navigateBtn}
              active={<Icon name="directions" size={20} color="white" />}
              idle={<Icon name="directions" size={20} color="white" />}
              onPress={() => {
                SubLocationsOnMapView.openGoogleMapApp(location.latitude, location.longitude, location.slug);
              }}
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}> {rowData.title.plain_text}</Text>
          </View>
        </View>
      </Thumbnail>
    );
  };

  render() {
    if (!this.state.subLocations || this.state.subLocations.length < 1) return null;

    return (
      <ViewContainer>
        <MapThumbnailsView
          items={this.state.subLocations}
          mapFlex={9}
          active={this.state.active}
          markers={this.state.markers}
          renderRow={this.renderRow}
        />
      </ViewContainer>
    );
  }
}
