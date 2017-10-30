/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Image } from "react-native";
import * as _ from "lodash";
import ViewContainer from "./view_container";
import ScaledTouchableItem from "./ScaledTouchable";
import DetailedAvatarListItem from "./DetailedAvatarListItem";

const WRAPPER_HEIGHT = 300;
const CORE_RAD = 150;
const WAVE1_RAD = 200;
const WAVE2_RAD = 250;
const FULL_WIDTH = Dimensions.get("window").width;

export default class RadarView extends Component {
  timer;

  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      animatedIn: false,
      imagesAnimValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    // this.timer = setInterval(()=>this.animate(),1000);
    Animated.spring(this.state.imagesAnimValue, { toValue: 1, friction: 2 }).start();
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  animate() {
    if (this.state.animatedIn) Animated.spring(this.state.animValue, { toValue: 1 }).start();
    else Animated.spring(this.state.animValue, { toValue: 0 }).start();

    this.setState({ animatedIn: !this.state.animatedIn });
  }

  displayImages() {
    const size1 = { width: 48, height: 48 };
    const size2 = { width: 40, height: 40 };
    const size3 = { width: 30, height: 30 };
    const size4 = { width: 20, height: 20 };

    let size;

    const images = this.props.sources.map((item, index) => {
      if (index < 2) size = size1;
      else if (index < 4) size = size2;
      else if (index < 5) size = size3;
      else size = size4;
      if (index < 7) {
        return (
          <ScaledTouchableItem key={index} ratio={1.3} style={styles.avatarContainer}>
            <Image style={[styles.avatar, size]} source={{ uri: item }} />
          </ScaledTouchableItem>
        );
      }
      if (index < 9) {
        return (
          <ScaledTouchableItem key={index} ratio={2} style={[styles.avatarContainer]}>
            <Image style={[styles.dot]} source={{ uri: item }} />
          </ScaledTouchableItem>
        );
      }
      // if(index<13)
      // return (
      //     <View key={index} style={styles.voidDot}>
      //     </View>
      // );
    });

    return _.shuffle(images);
    // return images;
  }

  render() {
    const scaleAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.4],
    });
    const rotateAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "130deg"],
    });
    const fadeAnim = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    const transform = [{ scale: scaleAnim, rotate: rotateAnim }];
    const animatedStyle = { transform, opacity: fadeAnim };
    return (
      <View style={[styles.radarItem, this.props.style]}>
        <View style={styles.wrapper}>
          <Animated.View style={[styles.absolutePosition, styles.contentContainer, { transform: [{ scale: this.state.imagesAnimValue }] }]}>
            <View style={[styles.imagesContainer]}>{this.displayImages()}</View>
          </Animated.View>

          <Animated.View style={[styles.absolutePosition, styles.coreContainer]} />

          <Animated.View style={[styles.absolutePosition, animatedStyle, styles.wave1Container]} />

          <Animated.View style={[styles.absolutePosition, animatedStyle, styles.wave2Container]} />
        </View>
        <View style={{ flex: 1 }}>
          <DetailedAvatarListItem
            style={{ marginVertical: 6 }}
            source={{ uri: "http://i.imgur.com/XMKOH81.jpg" }}
            title="Title for the avatar Item"
            body="Lorem ipsum dolor sit amet, consectetur ad aliqua. Ut enim ad minim.."
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radarItem: {
    flex: 1,
    minHeight: WRAPPER_HEIGHT + 100,
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
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    // backgroundColor:'rgba(244,0,244,1)',
    transform: [{ rotate: "45deg" }],
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
