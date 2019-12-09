/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity
} from "react-native";

const FULL_WIDTH = Dimensions.get("window").width;

type Props = {
  visible: any,
  onPress: any,
  content: any
};

type State = {
  visible: any,
  animValue: Animated.Value
};

export default class FloatingBtn extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { visible } = nextProps;
    const { animValue, visible: previouslyVisible } = prevState;

    if (visible !== previouslyVisible) {
      const animationProperties = visible
        ? { toValue: 1, friction: 2 }
        : { toValue: 0 };
      Animated.spring(animValue, animationProperties).start();
      return { visible };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = { animValue: new Animated.Value(0), visible: props.visible };
  }

  render() {
    const {
      props: { onPress, content },
      state: { animValue }
    } = this;

    const indexAnim = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 1000]
    });

    const outerWrapperStyle = [styles.wrapper, { zIndex: indexAnim }];
    const innerWrapperStyle = [
      styles.innerWrapper,
      { transform: [{ scale: animValue }] }
    ];

    return (
      <Animated.View style={outerWrapperStyle}>
        <Animated.View style={innerWrapperStyle}>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.mainContainer}
          >
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
    alignItems: "center"
  },
  innerWrapper: { flex: 1 },
  mainContainer: {
    flex: 1,
    height: 32,
    maxWidth: 140,
    backgroundColor: "rgba(211,80,152,1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    paddingHorizontal: 15,
    zIndex: 2000
  },
  text: { fontSize: 14, color: "white" }
});
