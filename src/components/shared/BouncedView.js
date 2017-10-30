/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";
import ViewContainer from "./view_container";

export default class BouncedView extends Component {
  translateY = 0;

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }
  componentDidMount() {
    Animated.spring(this.state.fadeAnim, { toValue: 1 }).start();
  }

  componentWillunmount() {
    Animated.spring(this.state.fadeAnim, { toValue: 0 }).start();
  }

  render() {
    return <Animated.View style={[this.props.style]}>{this.props.children}</Animated.View>;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
