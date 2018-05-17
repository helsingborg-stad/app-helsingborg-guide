import { StyleSheet } from "react-native";
import { StyleSheetUtils } from "../../../utils";
import { Colors, TextStyles } from "../../../styles";

export default StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderColor: Colors.listBackgroundColor,
  },
  textContainer: {
    paddingTop: "4%",
    paddingHorizontal: "4%",
    paddingBottom: "1%",
  },
  cancelResumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "4%",
    paddingBottom: "2%",
  },
  buttonText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.purple,
    },
  ]),
});
