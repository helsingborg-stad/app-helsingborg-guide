import React, { Component } from "react";
import { View, StyleSheet, ListView, Dimensions } from "react-native";
import MapView from "react-native-maps";
import ViewContainer from "./view_container";
import NoInternetText from "./noInternetText";
import { LocationService } from "../../services/locationService";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const TIMEOUT = 3000;
const FULL_WIDTH = Dimensions.get("window").width;
const THUMBNAIL_WIDTH = FULL_WIDTH * 0.7;

const markerImageActive = require("../../images/marker-active.png");
const markerImageInActive = require("../../images/marker-inactive.png");

const styles = StyleSheet.create({
  mapViewContainer: {
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  map: { flex: 1 },

  listViewContainer: {
    flex: 3,
  },

  itemsScroll: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: THUMBNAIL_WIDTH / 5,
    backgroundColor: "#fefefe",
  },
});

export default class MapThumbnailsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 56.04765769999999,
        longitude: 12.6888389,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      items: this.props.items || [],
      markers: this.props.markers || [],
      active: this.props.active || {}, // item which is slided to.
      connected: this.props.connected,
    };
    this.locationService = LocationService.getInstance();
  }

  componentDidMount() {
    // console.log('page did mount');
    if (this.state.markers.length) {
      this.markersTimeout = setTimeout(() => {
        this.focusMarkers(this.state.markers);
        this.sortGuidegroups();
      }, TIMEOUT);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.items.length !== nextProps.items.length) {
      this.setState({
        items: nextProps.items,
        active: nextProps.active,
        markers: nextProps.markers,
      });
    }
    if (nextProps.connected !== this.state.connected) this.setState({ connected: nextProps.connected });
  }

  componentWillUnmount() {
    if (this.markersTimeout) clearTimeout(this.markersTimeout);

    this.locationService.clearWatch();
  }

  sortItemsList(position) {
    const items = [];
    this.state.markers.forEach((marker) => {
      const mathDistance = this.locationService.getMathDistance(position.coords, marker.location);
      // make copy to not mutate the state by adding distance to the object.
      const item = Object.assign({}, this.state.items.find(item => item.id === marker.itemId));
      item.distance = mathDistance;
      items.push(item);
    });
    items.sort((a, b) => a.distance - b.distance);
    this.setState({ items, active: items[0] });
    this.scrollToItem(0, true);
  }

  // #########################
  // Map Methods
  // ##########################

  _onMarkerPressed(marker) {
    if (this.state.items && this.state.items.length) {
      const itemIndex = this.state.items.findIndex(item => item.id === marker.itemId);
      this.scrollToItem(itemIndex, false);
    }
  }

  scrollToItem(index, animated) {
    const shift = THUMBNAIL_WIDTH * index;
    this.itemsListView.scrollTo({ x: shift, animated });
  }

  _showMarkers() {
    if (!this.state.markers.length || !Object.keys(this.state.active).length) return null;
    const activeItem = this.state.active.id;
    return this.state.markers.map((marker) => {
      if (!marker.location.latitude || !marker.location.latitude) return null;
      const image = marker.itemId === activeItem ? markerImageActive : markerImageInActive;
      return (
        <MapView.Marker
          key={marker.itemId}
          coordinate={marker.location}
          image={image}
          identifier={`${marker.itemId}`}
          onPress={() => this._onMarkerPressed(marker)}
        />
      );
    });
  }

  focusMarkers(markers) {
    const edgePadding = {
      top: 100,
      right: 50,
      bottom: 20,
      left: 50,
    };
    const options = { edgePadding, animated: true };
    this.map.fitToCoordinates(markers.map(marker => marker.location), options);
    this.forceUpdate();
  }

  sortGuidegroups() {
    this.locationService
      .getGeoLocation()
      .then((position) => {
        this.sortItemsList(position);
      })
      .catch(err => console.log("error in location", err));
  }

  // ########################################3

  onScroll(e) {
    if (!this.state.markers.length) return;

    const xOffset = e.nativeEvent.contentOffset.x;
    const index = Math.abs(parseInt(xOffset / (THUMBNAIL_WIDTH - 20)));

    if (this.state.items[index].id !== this.state.active.id) {
      this.setState({ active: this.state.items[index] });
      const correspondingMarker = this.state.markers.find(marker => marker.itemId === this.state.items[index].id);
      this.map.animateToCoordinate(correspondingMarker.location);
    }
  }

  displayList() {
    if (!this.state.items.length) return null;
    return (
      <ListView
        contentContainerStyle={styles.itemsScroll}
        ref={(ref) => {
          this.itemsListView = ref;
        }}
        enableEmptySections
        dataSource={ds.cloneWithRows(this.state.items)}
        renderRow={this.props.renderRow}
        horizontal
        onScroll={e => this.onScroll(e)}
        scrollEventThrottle={1}
        // pageSize={1}
        // pagingEnabled={true}
        // snapToInterval={250}
        // snapToAlignment="center"
        // renderSeparator={()=><View style={{width:50,height:250}}></View>}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  displayNoInternet() {
    return <NoInternetText />;
  }

  displayListSection() {
    if (!this.state.connected && !this.state.items.length) return this.displayNoInternet();
    return this.displayList();
  }

  render() {
    const mapFlexStyle = this.props.mapFlex ? { flex: this.props.mapFlex } : null;
    return (
      <ViewContainer>
        <View style={[styles.mapViewContainer, mapFlexStyle]}>
          <MapView
            style={styles.map}
            ref={(ref) => {
              this.map = ref;
            }}
            initialRegion={this.state.region}
            showsUserLocation
            onRegionChange={this._onRegionChange}
            onLongPress={() => this.sortGuidegroups()}
          >
            {this._showMarkers()}
          </MapView>
        </View>

        <View style={styles.listViewContainer}>{this.displayListSection()}</View>
      </ViewContainer>
    );
  }
}
