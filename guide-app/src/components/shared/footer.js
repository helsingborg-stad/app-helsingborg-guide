import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

type Props = {
  style: any,
  children: Array,
};

const Footer = (props: Props) => (
    <View style={[styles.footer, props.style]}>{props.children}</View>
)

const styles = StyleSheet.create({
  footer: {
    minHeight: 60,
    width: Dimensions.get("window").width,
    alignItems: "stretch",
    justifyContent: "flex-start",
    position: "absolute",
    bottom: 0,
    zIndex: 20000,
  },
});

export default Footer;
