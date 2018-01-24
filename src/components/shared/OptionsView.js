/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from "react-native";

const MENU_WIDTH = Dimensions.get("window").width;
const MENU_HEIGHT = Dimensions.get("window").height;

export default class OptionsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      visible: this.props.visible,
    };
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
    this.animate(nextProps.visible);
  }

  animate(visible) {
    if (visible) Animated.timing(this.state.animValue, { toValue: 1, duration: 200 }).start();
    else Animated.timing(this.state.animValue, { toValue: 0, duration: 200 }).start();
  }

  onPress() {
    this.props.onPress();
  }

  render() {
    let animatedStyle;
    if (this.state.animValue) {
      const translateAnim = this.state.animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [MENU_WIDTH, 0],
      });

      const zIndexAnim = this.state.animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 10009],
      });

      animatedStyle = {
        // transform:[{translateX:translateAnim} ]
        opacity: this.state.animValue,
        zIndex: zIndexAnim,
      };
    }

    return (
      <Animated.View style={[styles.wrapper, this.props.style, animatedStyle]}>
        <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
          <View style={styles.mainContainer}>{this.props.children}</View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "flex-start",
    alignItems: "stretch",
    // backgroundColor:'white',
    width: MENU_WIDTH,
    height: MENU_HEIGHT,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10000,
  },
  mainContainer: {
    flex: 1,
    // backgroundColor:'red',
  },
});
