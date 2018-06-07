import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../../../styles/";
import { StyleSheetUtils } from "../../../utils/";

export default StyleSheet.create({
  touchableIcon: {
    flex: 1,
  },
  icon: {
    alignSelf: "center",
    height: 30,
    width: 30,
  },
  text: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 11,
      fontWeight: "500",
      color: Colors.white,
      alignSelf: "center",
      backgroundColor: "#ffffff00",
      paddingTop: 4,
    },
  ]),
});
