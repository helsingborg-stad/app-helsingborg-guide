import { StyleSheet } from "react-native";
import { TextStyles, Colors } from "../../../styles";

export default StyleSheet.create({
  collapsed: {
    overflow: "hidden"
  },
  readMoreText: StyleSheet.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.purple
    }
  ]),
  alphaGradient: {
    position: "absolute",
    width: "100%",
    height: 30,
    bottom: 0
  }
});
