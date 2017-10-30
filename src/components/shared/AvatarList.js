/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";

export default class AvatarList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.animValue, { toValue: 1 }).start();
  }

  render() {
    const translateAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [400, 0],
    });

    const animatedStyle = {
      transform: [{ translateY: translateAnim }],
    };

    return <Animated.ScrollView style={[this.props.style, animatedStyle]}>{this.props.children}</Animated.ScrollView>;
  }
}

const styles = StyleSheet.create({});
