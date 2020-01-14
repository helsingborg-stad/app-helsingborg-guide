/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  children: Array
};

export default class ButtonsBar extends Component<Props> {
  render() {
    return <View style={styles.bar}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding:10,
    backgroundColor: "white"
  }
});
