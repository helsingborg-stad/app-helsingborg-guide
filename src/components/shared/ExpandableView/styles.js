import { StyleSheet } from "react-native";
import { TextStyles, Colors } from "../../../styles";

export default StyleSheet.create({
  collapsed: {
    overflow: "hidden",
  },
  readMoreText: StyleSheet.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.purple,
      position: "absolute",
      bottom: 0,
      left: 0,
    },
  ]),
  alphaGradient: {
    position: "absolute",
    top: 30,
    width: "100%",
    height: "100%",
    bottom: 0,
  },
});
