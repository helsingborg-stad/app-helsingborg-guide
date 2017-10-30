/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class ViewContainer extends Component {
  render() {
    return (
      <View onMagicTap={this.props.onMagicTap} accessible={this.props.accessible} style={[styles.viewContainer, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "white",
  },
});
