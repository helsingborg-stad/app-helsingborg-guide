import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import OImage from "./image";

const styles = StyleSheet.create({
  imageContainer: {},
  image: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: { flex: 1, width: 100, height: 100 },
});

export default class ImageView extends Component {

  displayImage() {
    //Using full screen width and a 16:9 aspect ratio
    displayWidth = Dimensions.get("window").width;
    displayHeight = (displayWidth/16)*9;

    return (
      <OImage
        style={[
          {
            width: displayWidth,
            height: displayHeight,
            zIndex: 1000,
          },
          styles.image,
        ]}
        source={this.props.source}
        blurRadius={this.props.blur}
      >
        {this.props.children}
      </OImage>
    );
  }

  render() {
    return <View style={styles.imageContainer}>{this.displayImage()}</View>;
  }
}
