// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { MapItemUtils, MathUtils } from "../../../../utils";
import styles from "./styles";
import OffscreenMarker, { type OffscreenMarkerProps } from "./OffscreenMarker";
import { SegmentControlHeight } from "../../SegmentControl/styles";
import { ListHeight, ListBottomMargin } from "../../MarkerListView/styles";

const IMAGE_OFFSET = 60;
const HALF_IMAGE_OFFSET = IMAGE_OFFSET * 0.5;
const OFFSCREEN_ANGLE_MIN = -160 * MathUtils.DEG_TO_RAD;
const OFFSCREEN_ANGLE_MAX = 160 * MathUtils.DEG_TO_RAD;

type Props = {
  items: Array<MapItem>,
  userLocation: ?GeolocationType,
  activeMarker: MapItem,
  angleDelta: number
};

type State = {
  screen: {
    width: number,
    height: number,
    diagonal: number
  }
};

class OffscreenMarkersView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      screen: { width: 0, height: 0, diagonal: 0 }
    };
  }

  containerRef: ?View;

  getMarkers = (): Array<OffscreenMarkerProps> => {
    const {
      props: { items, angleDelta, userLocation, activeMarker },
      state: {
        screen: { width, height, diagonal }
      }
    } = this;

    if (userLocation) {
      const halfWidth = width * 0.5;
      const halfHeight = height * 0.5;

      const radius = diagonal * 0.5;

      const xLimits = {
        min: HALF_IMAGE_OFFSET - halfWidth,
        max: halfWidth - HALF_IMAGE_OFFSET
      };

      const yLimits = {
        min: HALF_IMAGE_OFFSET - halfHeight,
        max: halfHeight - HALF_IMAGE_OFFSET
      };

      const radians = (270 - angleDelta) * MathUtils.DEG_TO_RAD;
      const rx = Math.cos(radians) * radius;
      const ry = Math.sin(radians) * radius;
      const selectedMarkerId = MapItemUtils.getIdFromMapItem(activeMarker);
      const x = MathUtils.clamp(rx, xLimits);
      const y = MathUtils.clamp(ry, yLimits);
      const markerRotation = radians - Math.PI / 2;
      const visible =
        markerRotation > OFFSCREEN_ANGLE_MIN &&
        markerRotation < OFFSCREEN_ANGLE_MAX;

      // map all markers on a circle of the longest view dimension and then clip to view edges
      const markers: Array<OffscreenMarkerProps> = items.map((item, index) => {
        const markerId = MapItemUtils.getIdFromMapItem(item);
        const selected = markerId === selectedMarkerId;

        return {
          key: markerId,
          id: markerId,
          order: index,
          x,
          y,
          angle: markerRotation,
          selected,
          visible
        };
      });

      return markers.filter(marker => marker.selected);
    }

    return [];
  };

  onLayout = (event: any) => {
    const {
      screen: { width: currentWidth, height: currentHeight }
    } = this.state;
    if (this.containerRef) {
      // Measure the absolute position of the view on screen, i.e including navigation bar and status bar
      this.containerRef.measure((fx, fy, width, height) => {
        if (width !== currentWidth || height !== currentHeight) {
          const diagonal = Math.sqrt(width * width + height * height);
          this.setState({ screen: { width, height, diagonal } });
        }
      });
    } else {
      const {
        nativeEvent: {
          layout: { width, height }
        }
      } = event;

      if (width !== currentWidth || height !== currentHeight) {
        const diagonal = Math.sqrt(width * width + height * height);
        this.setState({ screen: { width, height, diagonal } });
      }
    }
  };

  render() {
    const markers = this.getMarkers();

    return (
      <View
        ref={ref => {
          this.containerRef = ref;
        }}
        style={{
          ...styles.container,
          top: SegmentControlHeight + 10,
          bottom: ListHeight + ListBottomMargin + 10
        }}
        onLayout={this.onLayout}
        pointerEvents="none"
      >
        {markers.map(marker => (
          <OffscreenMarker {...marker} />
        ))}
      </View>
    );
  }
}

const mapState = (state: RootState) => {
  const {
    arState: { angleDelta }
  } = state;
  return { angleDelta };
};

export default connect(mapState)(OffscreenMarkersView);
