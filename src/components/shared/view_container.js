import React from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "white",
  },
});

export default () => (
  <View onMagicTap={this.props.onMagicTap} accessible={this.props.accessible} style={[styles.viewContainer, this.props.style]}>
    {this.props.children}
  </View>
);
