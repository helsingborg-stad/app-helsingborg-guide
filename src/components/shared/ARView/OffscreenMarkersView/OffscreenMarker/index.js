// @flow
import React, { Component } from "react";
import { Text, Animated } from "react-native";
import * as Images from "../../../../../images/AR";
import styles from "./styles";

export type OffscreenMarkerProps = {
  id: string,
  order: number,
  x: number,
  y: number,
  angle: number,
  selected: boolean,
  visible: boolean,
};

export default class OffscreenMarker extends Component<OffscreenMarkerProps> {
  constructor(props: OffscreenMarkerProps) {
    super(props);

    this.animatedX = new Animated.Value(props.x);
    this.animatedY = new Animated.Value(props.y);
    this.animatedAngle = new Animated.Value(props.angle);
    this.opacity = new Animated.Value(props.visible ? 1 : 0);
  }

  componentWillReceiveProps(props: OffscreenMarkerProps) {
    const { visible } = this.props;

    Animated.spring(this.animatedX, {
      toValue: props.x,
    }).start();
    Animated.spring(this.animatedY, {
      toValue: props.y,
    }).start();
    Animated.spring(this.animatedAngle, {
      toValue: -props.angle - 180,
    }).start();

    if (props.visible !== visible) {
      Animated.spring(this.opacity, {
        toValue: props.visible ? 1 : 0,
      }).start();
    }
  }

  animatedX = new Animated.Value(0);

  animatedY = new Animated.Value(0);

  animatedAngle = new Animated.Value(0);

  opacity = new Animated.Value(0);

  render() {
    const { id, order, selected } = this.props;
    const imagePin = selected ? Images.PinSelected : Images.Pin;
    const rotation = this.animatedAngle.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <Animated.View
        key={id}
        style={{ ...styles.marker, opacity: this.opacity, transform: [{ translateX: this.animatedX }, { translateY: this.animatedY }] }}
      >
        <Animated.Image source={imagePin} style={{ transform: [{ rotateZ: rotation }] }} />
        <Text style={styles.label}>{`${order + 1}`}</Text>
      </Animated.View>
    );
  }
}
