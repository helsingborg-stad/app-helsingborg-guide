/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from "react-native";
import ViewContainer from "./view_container";

const FULL_WIDTH = Dimensions.get("window").width;

export default class FloatingBtn extends Component {
  constructor(props) {
    super(props);
    this.state = { animValue: new Animated.Value(0), visible: props.visible };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;
    const { animValue, visible: previouslyVisible } = prevState;

    if ( visible !== previouslyVisible) {
      const animationProperties = visible ? { toValue: 1, friction: 2 } : { toValue: 0 };
      Animated.spring(animValue, animationProperties).start();
      return { visible };
    }

    return null;
  }

  render() {
    const {
      props: { onPress. content },
      state: { animValue }
    } = this;

    const indexAnim = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 1000],
    });

    return (
      <Animated.View style={[styles.wrapper, { zIndex: indexAnim }]}>
        <Animated.View style={[{ flex: 1, transform: [{ scale: animValue }] }]}>
          <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.mainContainer}>
            <Text style={styles.text}>{content}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 32,
    width: FULL_WIDTH,
    // backgroundColor:'red',
    position: "absolute",
    top: 70,
    left: 0,
    zIndex: 1000,
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    height: 32,
    maxWidth: 140,
    backgroundColor: "rgba(211,80,152,1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    paddingHorizontal: 15,
    zIndex: 2000,
  },
  text: { fontSize: 14, color: "white" },
});
