// @flow
import React, { PureComponent } from "react";
import { View, Text, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapItemUtils } from "@utils";
import styles from "./styles";
import LocationUtils from "@utils/LocationUtils";

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
  userLocation: any,
  setActiveMarker: () => void,
  scrollToIndex: () => void,
  navigation: Object,
};
type State = {
  markersFocused: boolean,
};

class MapMarkerView extends PureComponent<Props, State> {
  static defaultProps = {
    showNumberedMapMarkers: true,
    onMapMarkerPressed: null
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      markersFocused: false,
      filteredMarkers: []
    };
  }

  longitudeDelta = 0;

  latitudeDelta = 0;

  map: ?MapView;

  componentDidMount() {
    let filtered = this.filterMarkers(this.props.items);
    this.setState({ filteredMarkers: filtered });
  }


  filterMarkers = (markers: MapItem[]) => {
    if (!this.state.filteredMarkers.length) {
      const result = markers.map(x => {
        const objX =
          x?.guide ||
          x?.guideGroup ||
          x?.interactiveGuide;
        const locationX = objX?.location;
        const nameX = objX?.name;
        if (locationX && nameX) {
          const latitudeX = locationX.latitude;
          const longitudeX = locationX.longitude;
          markers.map(y => {
            const objY =
              y?.guide ||
              y?.guideGroup ||
              y?.interactiveGuide;
            const locationY = objY?.location;
            const nameY = objY?.name;
            if (locationY && nameY) {
              const latitudeY = locationY.latitude;
              const longitudeY = locationY.longitude;
              let samecordinates = (longitudeX === longitudeY && latitudeX === latitudeY);
              if (samecordinates && nameX !== nameY) {
                if (x?.duplicates) {
                  x.duplicates = x.duplicates + 1;
                } else {
                  x.duplicates = 1;
                }
              }
            }
            return y;
          });
        }
        return x;
      });
      return result;
    } else return this.state.filteredMarkers;
  };

  focusMarkers(markers: MapItem[]) {
    if (!markers) {
      return;
    }

    const padding = 50;
    const edgePadding = {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
    const options = {
      edgePadding,
      animated: false
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

    const { duplicates } = mapItem;


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
          {duplicates && <View style={active ? styles.numberedMarkerDuplicatesActive : styles.numberedMarkerDuplicates}>
            <Text style={styles.numberedMarkerDuplicatesText}>+{duplicates}</Text>
          </View>
          }
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

  renderMapMarkers(items) {
    const { showNumberedMapMarkers } = this.props;
    const { filteredMarkers } = this.state;
    return filteredMarkers.map((item, index) => {
      if (showNumberedMapMarkers) {
        return this.numberedMapViewMarker(item, index + 1);
      }
      return this.defaultMapViewMarker(item, index + 1);
    });
  }

  onMapReady = () => {
    const { items, setActiveMarker, scrollToIndex } = this.props;
    const { markersFocused } = this.state;
    if (items.length > 0 && !markersFocused) {
      setActiveMarker(items[0]);
      scrollToIndex(0);
      this.focusMarkers(items);
      this.setState({ markersFocused: true });
      this.panMapToIndex(0);
    }
  };

  onMarkerPressed = (marker: MapItem) => {
    const { onMapMarkerPressed } = this.props;
    const { filteredMarkers } = this.state;
    const index = filteredMarkers.findIndex(item => item === marker);
    console.log("the index", index)
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
          longitudeDelta: this.longitudeDelta
        });
      }
    }
  };

  render() {
    const { items, userLocation, navigation } = this.props;
    const userCoords = userLocation?.coords || userLocation?.position?.coords || userLocation?.coords;
    const userLatitude = userCoords?.latitude;
    let initialLocation;
    const userLongitude = userCoords?.longitude;
    const cityLatitude = 56.04673;
    const cityLongitude = 12.69437;
    let fallbackLatitude;
    let fallbackLongitude;
    // CHECK IF USER IS CURRENTLY IN HELSINGBORG
    if (userLatitude && userLongitude && userLatitude < 56.10673 && userLatitude > 56.00673 && userLongitude < 12.79437 && userLongitude > 12.65437) {
      fallbackLatitude = userLatitude;
      fallbackLongitude = userLongitude;
    } else {
      fallbackLatitude = cityLatitude;
      fallbackLongitude = cityLongitude;
    }
    const latitude = initialLocation?.latitude || fallbackLatitude;
    const longitude = initialLocation?.longitude || fallbackLongitude;

    const coords = LocationUtils.getRegionForCoordinates([
      { latitude: latitude, longitude: longitude },
      { latitude: 0, longitude: 0 }
    ]);

    return (
      <View style={styles.container}>
        {navigation.isFocused() && latitude && longitude ?
          <MapView
            zoomEnabled={true}
            minZoomLevel={11}
            maxZoomLevel={17}
            ref={(ref) => {
              this.map = ref;
            }}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: coords.latitudeDelta,
              longitudeDelta: coords.longitudeDelta
            }}
            onRegionChange={() => null}
            onRegionChangeComplete={(e) => {
              this.longitudeDelta = e.longitudeDelta;
              this.latitudeDelta = e.latitudeDelta;
            }}
            style={styles.map}
            showsUserLocation={true}
            onMapReady={() => this.onMapReady()}
            loadingEnabled={true}
          >
            {this.renderMapMarkers(items)}

            {/*{this.state.filteredMarkers.length ? this.renderMapMarkers() : null}*/}
          </MapView> : null}
      </View>
    );
  }
}


export default MapMarkerView;

