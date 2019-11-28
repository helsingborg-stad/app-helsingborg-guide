/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonsBarItem from "./btn_bar_item";

const FULL_WIDTH = Dimensions.get("window").width;

export default class SlimNotificationBar extends Component {
  constructor(props) {
    super(props);
    this.state = { animValue: new Animated.Value(0) };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;
    const animationProperties = visible ? { toValue: 1, friction: 2 } : { toValue: 0 };
    Animated.spring(prevState.animValue, animationProperties).start();
  }

  render() {
    const { state: { animValue } } = this;

    const indexAnim = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10000, 2000],
    });

    return (
      <Animated.View style={[styles.bar, this.props.style || null, { opacity: animValue, zIndex: indexAnim }]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 30,
    width: FULL_WIDTH,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -200000,
    backgroundColor: "#ed57ac",
    justifyContent: "center",
    alignItems: "center",
  },
});
