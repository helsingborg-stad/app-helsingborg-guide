/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { TextStyles } from "@assets/styles";

const WRAPPER_HEIGHT = 200;
const CORE_RAD = 120;
const WAVE1_RAD = 150;
const WAVE2_RAD = 180;
const FULL_WIDTH = Dimensions.get("window").width;

type Props = {
  style: any,
  title: any,
};

type State = {
  animValue: Animated.Value,
  scaleAnim: Animated.Value,
  animatedIn: boolean,
};

export default class RadarView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      scaleValue: new Animated.Value(1),
      animatedIn: false,
    };
  }

  componentDidMount() {
    this.animate();
    this.timer = setInterval(() => this.animate(), 1000);
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    Animated.spring(this.state.scaleValue, { toValue: 0, useNativeDriver: true }).start();
  }

  timer;

  animate() {
    if (this.state.animatedIn) {
      Animated.spring(this.state.animValue, { toValue: 1, useNativeDriver: true }).start();
    } else {
      Animated.spring(this.state.animValue, { toValue: 0, useNativeDriver: true }).start();
    }

    this.setState({ animatedIn: !this.state.animatedIn });
  }

  render() {
    const scaleAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1.1],
    });

    // const rotateAnim = this.state.animValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ["0deg", "130deg"]
    // });

    const fadeAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 1],
    });

    const transform = [{ scale: scaleAnim }];
    const animatedStyle = { transform, opacity: fadeAnim };
    return (
      <Animated.View
        style={[
          styles.radarItem,
          this.props.style,
          { transform: [{ scale: this.state.scaleValue }] },
        ]}
      >
        <View style={styles.wrapper}>
          <Animated.View
            style={[styles.absolutePosition, styles.contentContainer]}
          >
            <View style={[styles.textContainer]}>
              <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                {this.props.title}
              </Animated.Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.absolutePosition, styles.coreContainer]}
          />

          <Animated.View
            style={[
              styles.absolutePosition,
              animatedStyle,
              styles.wave1Container,
            ]}
          />

          <Animated.View
            style={[
              styles.absolutePosition,
              animatedStyle,
              styles.wave2Container,
            ]}
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  radarItem: {
    flex: 1,
    minHeight: WRAPPER_HEIGHT,
    // backgroundColor:'red'
  },
  wrapper: {
    flex: 2,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 50,
    width: FULL_WIDTH,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(222,222,211,0.5)",
    borderRadius: 150,
  },
  absolutePosition: {
    flex: 1,
    position: "absolute",
  },
  coreContainer: {
    flex: 1,
    top: (WRAPPER_HEIGHT - CORE_RAD) / 2,
    left: (FULL_WIDTH - CORE_RAD) / 2,
    borderRadius: CORE_RAD / 2,
    // backgroundColor:'#e554a6',
    backgroundColor: "#fcf4fd",
    width: CORE_RAD,
    height: CORE_RAD,
    zIndex: 10,
    // padding:-30,
    borderWidth: 1,
    borderColor: "#dd51a0",
  },
  contentContainer: {
    top: (WRAPPER_HEIGHT - WAVE2_RAD) / 2,
    left: (FULL_WIDTH - WAVE2_RAD) / 2,
    // borderRadius:WAVE1_RAD/2,
    // backgroundColor:'rgba(244,244,244,1)',
    width: WAVE2_RAD,
    height: WAVE2_RAD,
    padding: 40,
    zIndex: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  text: {
    ...TextStyles.bold,
    fontSize: 14,
    color: "#dd51a0",
    textAlign: "center",
  },

  avatarContainer: { width: 50, height: 50 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "white",
    transform: [{ rotate: "315deg" }],
  },
  dotContainer: {
    width: 20,
    height: 20,
  },
  dot: {
    width: 10,
    height: 10,
    // backgroundColor:'#dd51a0',
    borderRadius: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  smallDot: {
    width: 6,
    height: 6,
    backgroundColor: "green",
    borderRadius: 3,
    margin: 3,
  },
  voidDot: {
    width: 10,
    height: 10,
    margin: 5,
  },
  wave1Container: {
    top: (WRAPPER_HEIGHT - WAVE1_RAD) / 2,
    left: (FULL_WIDTH - WAVE1_RAD) / 2,
    borderRadius: WAVE1_RAD / 2,
    backgroundColor: "rgba(244,244,244,0.3)",
    width: WAVE1_RAD,
    height: WAVE1_RAD,
    zIndex: 8,
  },
  wave2Container: {
    top: (WRAPPER_HEIGHT - WAVE2_RAD) / 2,
    left: (FULL_WIDTH - WAVE2_RAD) / 2,
    borderRadius: WAVE2_RAD / 2,
    backgroundColor: "rgba(237,88,172,0.2)",
    width: WAVE2_RAD,
    height: WAVE2_RAD,
    zIndex: 7,
  },
});
