/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default class MyImage extends Component {
  displayImage() {
    let uri = this.props.source;
    if (!uri || !uri.uri) uri = require("../../images/no-image-featured-image.png");
    return <Image style={styles.image} source={uri} />;
  }
  render() {
    return this.displayImage();
  }
}

const styles = StyleSheet.create({
  image: { flex: 1 },
});
