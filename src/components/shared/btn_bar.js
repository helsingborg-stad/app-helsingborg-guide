import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bar: {
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
});

const ButtonsBar = ({ children }) => <View style={styles.bar}>{children}</View>;

ButtonsBar.propTypes = {
  children: PropTypes.array.isRequired,
};

export default ButtonsBar;
