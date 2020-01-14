/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { StyleSheet, Dimensions, Animated } from "react-native";
import { Colors } from "@assets/styles";

const FULL_WIDTH = Dimensions.get("window").width;

type Props = {
  visible: any,
  style: any,
  children: Array
};

type State = {
  visible: any
};

export default class SlimNotificationBar extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { visible } = nextProps;
    const animationProperties = visible
      ? { toValue: 1, friction: 2 }
      : { toValue: 0 };
    Animated.spring(prevState.animValue, animationProperties).start();
  }

  constructor(props) {
    super(props);
    this.state = { animValue: new Animated.Value(0) };
  }

  render() {
    const {
      state: { animValue }
    } = this;

    const indexAnim = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10000, 2000]
    });

    return (
      <Animated.View
        style={[
          styles.bar,
          this.props.style || null,
          { opacity: animValue, zIndex: indexAnim }
        ]}
      >
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
    backgroundColor: Colors.themeExtra3,
    justifyContent: "center",
    alignItems: "center"
  }
});
