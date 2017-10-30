/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ImageView from "./image_view";
import Icon from "react-native-vector-icons/FontAwesome";

export default class RoundedThumbnail extends Component {
  render() {
    return (
      <View style={styles.thumbnailContainer}>
        <Image source={this.props.imageSource} style={styles.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumbnailContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  iconContainer: { flex: 1, justifyContent: "center" },
});
