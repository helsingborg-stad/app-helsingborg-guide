// @flow
import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import { MapItemUtils, MathUtils, LocationUtils } from "../../../../utils";
import * as Images from "../../../../images/AR";
import styles from "./styles";

const IMAGE_OFFSET = 60;
const HALF_IMAGE_OFFSET = IMAGE_OFFSET * 0.5;
const OFFSCREEN_ANGLE_MIN = -135;
const OFFSCREEN_ANGLE_MAX = 135;

type Props = {
  items: Array<MapItem>,
  userLocation: ?GeolocationType,
  degree: number,
  activeMarker: MapItem,
};
type State = {
  screen: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
};

const OffscreenMarker = (marker) => {
  const { id, x, y, angle, selected } = marker;
  const imagePin = selected ? Images.PinSelected : Images.Pin;

  return (
    <View key={id} style={{ ...styles.marker, transform: [{ translateX: x }, { translateY: y }] }}>
      <Image source={imagePin} style={{ transform: [{ rotateZ: `${angle - 180}deg` }] }} />
      <Text style={styles.label}>{id}</Text>
    </View>
  );
};

export default class OffscreenMarkers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      screen: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  _getMarkers = () => {
    const {
      props: { items, degree: currentBearing, userLocation, activeMarker },
      state: {
        screen: { width, height },
      },
    } = this;

    if (userLocation) {
      const radius = Math.max(width, height);

      const halfWidth = width * 0.5;
      const halfHeight = height * 0.5;

      const xLimits = {
        min: HALF_IMAGE_OFFSET - halfWidth,
        max: halfWidth - HALF_IMAGE_OFFSET,
      };

      const yLimits = {
        min: HALF_IMAGE_OFFSET - halfHeight,
        max: halfHeight - HALF_IMAGE_OFFSET,
      };

      // map all markers on a circle of the longest view dimension and then clip to view edges
      const markers = items.map((item) => {
        const markerLocation = MapItemUtils.getLocationFromItem(item);
        let angle = LocationUtils.angleBetweenCoords(userLocation.coords, markerLocation);
        angle = angle - currentBearing < 0 ? angle - currentBearing + 360 : angle - currentBearing;

        const radians = (angle - 90) * MathUtils.DEG_TO_RAD;
        const rx = Math.cos(radians) * radius - halfWidth;
        const ry = Math.sin(radians) * radius - halfHeight;

        const x = MathUtils.clamp(rx, xLimits);
        const y = MathUtils.clamp(ry, yLimits);

        const markerId = MapItemUtils.getIdFromMapItem(item);
        const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
        const selected = markerId === selectedMarkerId;

        return { id: markerId, x, y, angle, selected };
      });

      // make the selected marker always be on top
      markers.sort((a, b) => {
        if (a.selected) return 1;
        if (b.selected) return -1;
        return a.id - b.id;
      });

      return markers.filter(
        marker => marker.selected && (marker.angle - 180 > OFFSCREEN_ANGLE_MIN && marker.angle - 180 < OFFSCREEN_ANGLE_MAX),
      );
    }

    return [];
  };

  _onLayout = (event) => {
    const {
      nativeEvent: {
        layout: { x, y, width, height },
      },
    } = event;
    this.setState({ screen: { x, y, width, height } });
  };

  render() {
    const markers = this._getMarkers();

    return (
      <View style={styles.container} onLayout={this._onLayout}>
        {markers.map(OffscreenMarker)}
      </View>
    );
  }
}
