/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { StyleSheet, TouchableWithoutFeedback, Animated } from "react-native";

type Props = {
  ratio: any,
  onPress: any,
  style: any,
  children: Array
};

type State = {
  animValue: Animated.Value
};

export default class ScaledTouchableItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0)
    };

    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
  }

  onPressIn() {
    Animated.spring(this.state.animValue, { toValue: 1 }).start();
  }
  onPressOut() {
    Animated.spring(this.state.animValue, { toValue: 0 }).start();
  }
  render() {
    const scaleAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, this.props.ratio]
    });
    const style = { transform: [{ scale: scaleAnim }] };
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
      >
        <Animated.View style={[style, styles.mainContainer, this.props.style]}>
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    zIndex: 100
  }
});
