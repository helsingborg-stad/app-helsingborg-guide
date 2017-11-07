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

export default props => (
  <View onMagicTap={props.onMagicTap} accessible={props.accessible} style={[styles.viewContainer, props.style]}>
    {props.children}
  </View>
);
