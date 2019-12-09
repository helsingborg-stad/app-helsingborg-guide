// @flow
import { StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

export default StyleSheet.create({
  label: {
    color: Colors.white,
    fontFamily: "Arial",
    fontSize: 20,
    position: "absolute"
  },
  marker: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute"
  }
});
