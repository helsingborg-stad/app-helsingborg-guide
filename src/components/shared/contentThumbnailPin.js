/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const IMAGE_WIDTH = 120;
const FULL_WIDTH = Dimensions.get("window").width;
const FULL_HEIGHT = Dimensions.get("window").height;
const HALF_WIDTH = FULL_WIDTH / 2 - 30;
const DEFAULT_IMAGE = require("../../images/no-image-featured-image.png");

export default class ContentThumbnailPin extends Component {
  _getOptWidth(width, height) {
    if (true || width > height) return width * (HALF_WIDTH / width);
    return width * (HALF_WIDTH / height);
  }
  _getOptHeight(width, height) {
    if (true || width > height) return height * (HALF_WIDTH / width);
    return height * (HALF_WIDTH / height);
  }

  displayImage() {
    let uri = this.props.source;
    if (!uri || !uri.uri) uri = DEFAULT_IMAGE;
    return (
      <Image
        style={[
          styles.image,
          {
            width: this._getOptWidth(this.props.imageWidth, this.props.imageHeight),
            height: this._getOptHeight(this.props.imageWidth, this.props.imageHeight),
          },
        ]}
        resizeMethod="scale"
        resizeMode="center"
        source={uri}
      // blurRadius={this.props.blur}
      />
    );
  }

  render() {
    return (
      <View style={[styles.thumbnail]}>
        {this.displayImage()}
        <View style={styles.bodyContainer}>{/* {this.props.children} */}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumbnail: {
    flex: 1,
    borderColor: "#ebebeb",
    backgroundColor: "white",
    // borderWidth:10,
    paddingBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    borderRadius: 10,
  },
  bodyContainer: { flex: 4, justifyContent: "flex-start", alignItems: "flex-start" },
  checkedContainer: {
    width: 30,
    height: 30,
    backgroundColor: "#D35098",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
});
