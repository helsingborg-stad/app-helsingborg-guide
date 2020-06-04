import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  touchableIcon: {
    flex: 1,
  },
  iconView: {
    alignSelf: "center",
    flex: 1,
  },
  text: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      fontWeight: "500",
      color: Colors.white,
      alignSelf: "center",
      backgroundColor: Colors.transparent,
      paddingTop: 4,
    },
  ]),
});
