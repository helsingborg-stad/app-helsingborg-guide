// @flow
import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapItemUtils } from "@utils";
import styles from "./styles";

const locationMarkerActive = require("@assets/images/map/marker-location-active.png");
const locationMarkerInactive = require("@assets/images/map/marker-location.png");

const trailMarkerActive = require("@assets/images/map/marker-trail-active.png");
const trailMarkerInactive = require("@assets/images/map/marker-trail.png");

const numberedMarkerActive = require("@assets/images/map/marker-number-active.png");
const numberedMarkerInactive = require("@assets/images/map/marker-number.png");

type Props = {
  items: MapItem[],
  showNumberedMapMarkers?: boolean,
  onMapMarkerPressed?: ?(index: number) => void,
  activeMarker: MapItem,
  initialLocation?: Location,
};
type State = {
  markersFocused: boolean,
};

class MapMarkerView extends Component<Props, State> {
  static defaultProps = {
    showNumberedMapMarkers: true,
    onMapMarkerPressed: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      markersFocused: false,
    };
  }

  longitudeDelta = 0;

  latitudeDelta = 0;

  map: ?MapView;

  focusMarkers(markers: MapItem[]) {
    if (!markers) {
      return;
    }

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
    const locations: Location[] = MapItemUtils.getLocations(markers);
    if (this.map) {
      this.map.fitToCoordinates(locations, options);
    }
  }

  markerImageForTrailObject(trailObject: MapItem, active: boolean) {
    const { showNumberedMapMarkers } = this.props;
    const { guide } = trailObject;
    let image;
    if (showNumberedMapMarkers) {
      image = active ? numberedMarkerActive : numberedMarkerInactive;
    } else if (guide) {
      const { guideType } = guide;
      if (guideType === "trail") {
        image = active ? trailMarkerActive : trailMarkerInactive;
      } else {
        image = active ? trailMarkerActive : trailMarkerInactive;
      }
    } else {
      image = active ? locationMarkerActive : locationMarkerInactive;
    }
    return image;
  }

  numberedMapViewMarker = (mapItem: MapItem, index: number) => {
    const id = MapItemUtils.getIdFromMapItem(mapItem);
    const location: ?Location = MapItemUtils.getLocationFromItem(mapItem);
    // TODO: something better, like a default marker telling there's a location missing?
    if (!location) {
      return null;
    }

    const { activeMarker } = this.props;
    const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;
    const markerImage = this.markerImageForTrailObject(mapItem, active);
    const numberString: string = `${index}`;
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
        onPress={!active ? () => this.onMarkerPressed(mapItem) : null}
        anchor={{ x: 0.5, y: 1 }}
        centerOffset={{ x: 0.5, y: 1 }}
        zIndex={zIndex}
      >
        <View style={styles.numberedMarkerOuterContainer}>
          <View
            style={
              active
                ? styles.numberedMarkerContainerActive
                : styles.numberedMarkerContainer
            }
          >
            <Image style={styles.numberedMarkerImage} source={markerImage} />
            <View
              style={
                active
                  ? styles.numberedMarkerTextContainerActive
                  : styles.numberedMarkerTextContainer
              }
            >
              <Text
                allowFontScaling={false}
                style={
                  active
                    ? styles.numberedMarkerTextActive
                    : styles.numberedMarkerText
                }
              >
                {numberString}
              </Text>
            </View>
          </View>
        </View>
      </Marker>
    );
  };

  defaultMapViewMarker = (mapItem: MapItem, index: number) => {
    const id = MapItemUtils.getIdFromMapItem(mapItem);
    const location: ?Location = MapItemUtils.getLocationFromItem(mapItem);

    // TODO: something better, like a default marker telling there's a location missing?
    if (!location) {
      return null;
    }

    const { activeMarker } = this.props;
    const active = MapItemUtils.getIdFromMapItem(activeMarker) === id;
    const markerImage = this.markerImageForTrailObject(mapItem, active);
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
        zIndex={zIndex}
      />
    );
  };

  renderMapMarkers(items: Array<MapItem>): Array<any> {
    const { showNumberedMapMarkers } = this.props;
    return items.map((item, index) => {
      if (showNumberedMapMarkers) {
        return this.numberedMapViewMarker(item, index + 1);
      }
      return this.defaultMapViewMarker(item, index + 1);
    });
  }

  onMapReady = () => {
    const { items } = this.props;
    const { markersFocused } = this.state;
    if (items.length > 0 && !markersFocused) {
      this.focusMarkers(items);
      this.setState({ markersFocused: true });
    }
  };

  onMarkerPressed = (marker: MapItem) => {
    const { items, onMapMarkerPressed } = this.props;
    const index = items.findIndex(item => item === marker);

    if (onMapMarkerPressed) {
      onMapMarkerPressed(index);
    }

    this.panMapToIndex(index);
  };

  panMapToIndex = (index: number) => {
    const { items } = this.props;
    const marker = items[index];
    const { activeMarker } = this.props;

    if (marker !== activeMarker) {
      const location = MapItemUtils.getLocationFromItem(marker);
      if (this.map && location) {
        this.map.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: this.latitudeDelta,
          longitudeDelta: this.longitudeDelta,
        });
      }
    }
  };

  render() {
    const { items, initialLocation } = this.props;

    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => {
            this.map = ref;
          }}
          onRegionChangeComplete={(e) => {
            this.longitudeDelta = e.longitudeDelta;
            this.latitudeDelta = e.latitudeDelta;
          }}
          style={styles.map}
          showsUserLocation
          onMapReady={this.onMapReady}
          initialRegion={{
            latitude: initialLocation && initialLocation.latitude,
            longitude: initialLocation && initialLocation.longitude,
            latitudeDelta: this.latitudeDelta,
            longitudeDelta: this.longitudeDelta,
          }}
        >
          {this.renderMapMarkers(items)}
        </MapView>
      </View>
    );
  }
}

export default MapMarkerView;
