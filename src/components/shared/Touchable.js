/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from "react-native";
import ViewContainer from "./view_container";

export default class TouchableItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(1),
    };

    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
  }

  onPressIn() {
    Animated.spring(this.state.animValue, { toValue: 1.5 }).start();
  }
  onPressOut() {
    Animated.spring(this.state.animValue, { toValue: 1 }).start();
  }
  render() {
    const style = { transform: [{ scale: this.state.animValue }] };
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress} onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
        <Animated.View style={[style, styles.mainContainer, this.props.style]}>{this.props.children}</Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {},
});
