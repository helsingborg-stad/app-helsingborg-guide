import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  ListView,
  StyleSheet,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StatusBar,
  Button,
  Linking,
  AsyncStorage,
} from "react-native";

import { NativeModules } from "react-native";
import ViewContainer from "../shared/view_container";
import Navbar from "../shared/navbar";
import Thumbnail from "../shared/thumbnail2";
import MapThumbnailsView from "../shared/MapThumbnailsView";
import { TimingService } from "../../services/timingService";
import { LangService } from "../../services/langService";
import SubLocationView from "./SubLocationView";
import RoundedBtn from "../shared/roundedBtn";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class SubLocationsOnMapView extends Component {
  constructor(props) {
    super(props);

    this.state = this.buildState(this.props.subLocations);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("subloactionviewon map will receive next props");

    if (this.props.subLocations.length != nextProps.subLocations.length) {
      this.setState(this.buildState(nextProps.subLocations));
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onItemPress(id) {
    this.props.navigator.push({
      component: SubLocationView,
      title: "SubLocationView",
      passProps: { subLocationId: id },
    });
  }

  // ########################################3

  makeMarkersFromLocations(subLocations) {
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

  filterSubLocationsWithoutLocationObject(subLocations) {
    if (!subLocations || !subLocations.length) return [];
    return subLocations.filter((item) => {
      const location = item._embedded.location;
      return !(!item._embedded || !location.length || !location[0].id);
    });
  }

  buildState(_subLocations) {
    const subLocations = this.filterSubLocationsWithoutLocationObject(_subLocations);

    return {
      subLocations,
      active: subLocations[0],
      markers: this.makeMarkersFromLocations(subLocations) || [],
    };
  }

  openGoogleMapApp(lat, lng, slug) {
    let url = `google.navigation:q=${lat},${lng}`;
    if (Platform.OS === "ios") url = `maps.apple.com/?ll=${lat},${lng}`;

    // let url =  encodeURI('geo:'+lat+','+lng+'?saddr='+slug);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          // console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  renderRow(rowData, section) {
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
                this.openGoogleMapApp(location.latitude, location.longitude, location.slug);
              }}
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}> {rowData.title.plain_text}</Text>
          </View>
        </View>
      </Thumbnail>
    );
  }

  render() {
    if (!this.state.subLocations || this.state.subLocations.length < 1) return null;

    const title = this.state.subLocations[0].guidegroup[0].name;

    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigator.pop()}>
        <Icon name="chevron-left" size={32} color="white" />
      </TouchableOpacity>
    );

    return (
      <ViewContainer>
        <Navbar title={title} leftButton={leftBtn} backgroundColor="#7B075E" />

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

// ##########################################

const styles = StyleSheet.create({
  thumbnailExtraContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 3,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "300",
  },
  navigateBtnContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  navigateBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#D35098",
  },
});
