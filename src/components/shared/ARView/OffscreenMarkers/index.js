// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
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
  activeMarker: MapItem,
  compassBearing: number,
  style: any,
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
  const { id, order, x, y, angle, selected } = marker;
  const imagePin = selected ? Images.PinSelected : Images.Pin;

  return (
    <View key={id} style={{ ...styles.marker, transform: [{ translateX: x }, { translateY: y }] }}>
      <Image source={imagePin} style={{ transform: [{ rotateZ: `${angle - 180}deg` }] }} />
      <Text style={styles.label}>{`${order + 1}`}</Text>
    </View>
  );
};

class OffscreenMarkers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      screen: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  containerRef;

  getMarkers = () => {
    const {
      props: { items, compassBearing, userLocation, activeMarker },
      state: {
        screen: { width, height, y: containerY },
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
      const markers = items.map((item, index) => {
        const markerLocation = MapItemUtils.getLocationFromItem(item);
        let angle = LocationUtils.angleBetweenCoords(userLocation.coords, markerLocation);
        angle = angle - compassBearing < 0 ? angle - compassBearing + 360 : angle - compassBearing;

        const radians = (angle - 90) * MathUtils.DEG_TO_RAD;
        const rx = Math.cos(radians) * radius - halfWidth;
        const ry = Math.sin(radians) * radius - halfHeight + containerY;

        const x = MathUtils.clamp(rx, xLimits);
        const y = MathUtils.clamp(ry, yLimits);

        const markerId = MapItemUtils.getIdFromMapItem(item);
        const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
        const selected = markerId === selectedMarkerId;

        return { id: markerId, order: index, x, y, angle, selected };
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

  onLayout = (event) => {
    if (this.containerRef) {
      // Measure the absolut position of the view on screen, i.e including navigation bar and status bar
      this.containerRef.measure((fx, fy, width, height, px, py) => {
        this.setState({ screen: { x: fx, y: py, width, height } });
      });
    } else {
      const {
        nativeEvent: {
          layout: { x, y, width, height },
        },
      } = event;

      this.setState({ screen: { x, y, width, height } });
    }
  };

  render() {
    const { style } = this.props;
    const markers = this.getMarkers();

    return (
      <View
        ref={(ref) => {
          this.containerRef = ref;
        }}
        style={[styles.container, style]}
        onLayout={this.onLayout}
      >
        {markers.map(OffscreenMarker)}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  const {
    geolocation: { bearing },
  } = state;

  return {
    compassBearing: bearing,
  };
}

export default connect(
  mapStateToProps,
  null,
)(OffscreenMarkers);
