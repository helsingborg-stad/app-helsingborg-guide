import { StyleSheet } from "react-native";
import { StyleSheetUtils } from "../../../utils";
import { Colors, TextStyles } from "../../../styles";

export default StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderColor: Colors.listBackgroundColor
  },
  doneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "2%",
    paddingHorizontal: "4%",
    paddingBottom: "2%"
  },
  doneText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      color: Colors.green
    }
  ]),
  textContainer: {
    paddingTop: "4%",
    paddingHorizontal: "4%",
    paddingBottom: "2%",
    alignItems: "center"
  },
  cancelResumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "4%",
    paddingBottom: "3%"
  },
  buttonText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.purple
    }
  ]),
  progressBarAndroid: {
    marginTop: -4,
    marginBottom: -8
  },
  progressViewIOS: {
    transform: [{ scaleX: 1.0 }, { scaleY: 2.5 }]
  }
});
