import React, { Component } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const Dimensions = require("Dimensions");
const Background = require("../../images/black.png");

const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    left: (Dimensions.get("window").width / 2) - 25,
    top: (Dimensions.get("window").height / 2) - 25,
  },
  overlay: {
    flex: 1,
    opacity: 1,
    position: "absolute",
    left: 0,
    top: 0,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    left: 0,
    top: 0,
    position: "absolute",
  },
  imageHolder: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: "black",
    width: Dimensions.get("window").width,
  },
});

class ActivityIndicatorExample extends Component {
  state = { animating: true }

  componentDidMount = () => this.closeActivityIndicator();

  closeActivityIndicator = () => setTimeout(() => this.setState({
    animating: false,
  }), 600000);

  render() {
    const animating = this.state.animating;
    return (
      <View style={styles.imageHolder}>
        <Image source={Background} style={styles.image} />
        <ActivityIndicator
          animating={animating}
          color="#bc2b78"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  }
}
export default ActivityIndicatorExample;

/*

        */
