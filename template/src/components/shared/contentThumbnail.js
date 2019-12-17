import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import OImage from "./image";
import { Colors } from "@assets/styles";

const FULL_WIDTH = Dimensions.get("window").width;
const IMAGE_WIDTH = FULL_WIDTH / 2 - FULL_WIDTH / 10;

const styles = StyleSheet.create({
  thumbnail: {
    flex: 1,
    borderColor: Colors.gray10,
    backgroundColor: Colors.white,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH
  },
  bodyContainer: {
    maxWidth: IMAGE_WIDTH,
    minWidth: IMAGE_WIDTH,
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  checkedContainer: {
    width: 30,
    height: 30,
    backgroundColor: Colors.themeControl,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center"
  }
});

type Props = {
  checked: any,
  imageSource: any,
  guideID: any,
  children: Array
};

export default class ContentThumbnail extends Component<Props> {
  displayImage() {
    const checkMarkIcon = (
      <View style={styles.checkedContainer}>
        <Icon
          name="ios-checkmark-circle-outline"
          size={20}
          color={Colors.white}
        />
      </View>
    );
    const checkMark = this.props.checked ? checkMarkIcon : null;

    return (
      <OImage
        style={[{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }, styles.image]}
        source={this.props.imageSource}
        guideID={this.props.guideID}
      >
        {checkMark}
      </OImage>
    );
  }

  render() {
    return (
      <View style={styles.thumbnail}>
        {this.displayImage()}
        <View style={styles.bodyContainer}>{this.props.children}</View>
      </View>
    );
  }
}
