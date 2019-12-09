// @flow
import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";

export default StyleSheet.create({
  hintContainer: {
    alignItems: "center",
    height: 22,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    width: "100%"
  },
  hintOverlay: {
    backgroundColor: Colors.black,
    justifyContent: "center",
    opacity: 0.75,
    padding: 10,
    position: "absolute"
  },
  hintText: {
    ...TextStyles.body,
    color: Colors.white,
    flex: 1,
    textAlign: "center"
  }
});
