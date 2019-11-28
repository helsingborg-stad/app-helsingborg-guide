/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";

const MENU_WIDTH = Dimensions.get("window").width;
const MENU_HEIGHT = Dimensions.get("window").height;

type Props = {
  visible: any,
  onPress: any,
  style: any,
  children: Array
};

type State = {
  visible: any,
  animValue: Animated.Value
};

export default class OptionsView extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { visible } = nextProps;
    const { animValue, visible: previouslyVisible } = prevState;

    if (visible !== previouslyVisible) {
      const animationProperties = visible
        ? { toValue: 1, duration: 200 }
        : { toValue: 0, duration: 200 };
      Animated.timing(animValue, animationProperties).start();
      return { visible };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = { animValue: new Animated.Value(0), visible: props.visible };
  }

  onPress() {
    this.props.onPress();
  }

  render() {
    const {
      state: { animValue }
    } = this;

    // const translateAnim = animValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [MENU_WIDTH, 0]
    // });

    const zIndexAnim = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 10009]
    });

    const animatedStyle = {
      // transform:[{translateX:translateAnim} ]
      opacity: animValue,
      zIndex: zIndexAnim
    };

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
    zIndex: 10000
  },
  mainContainer: {
    flex: 1
    // backgroundColor:'red',
  }
});
