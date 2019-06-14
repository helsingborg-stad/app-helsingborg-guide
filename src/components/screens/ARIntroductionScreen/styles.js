import { StyleSheet, Dimensions } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export const ScreenWidth = Dimensions.get("window").width;
export const ScreenHeight = Dimensions.get("window").height;

const ButtonWidth = ScreenWidth - 60;

export default StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  instructions: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      letterSpacing: 0.09,
      lineHeight: 23,
      marginHorizontal: 40,
      textAlign: "center",
    },
  ]),
  outerContainer: {
    height: ScreenHeight,
  },
  startButton: {
    alignItems: "center",
    backgroundColor: Colors.purple,
    borderRadius: 5,
    flexDirection: "row",
    height: 45,
    justifyContent: "center",
    margin: 30,
    textAlign: "center",
    width: ButtonWidth,
  },
  startButtonText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.white,
    },
  ]),
  title: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.black,
      fontSize: 32,
      fontWeight: "bold",
      letterSpacing: 0.09,
      lineHeight: 36,
      marginHorizontal: 20,
      marginTop: 70,
      textAlign: "center",
    },
  ]),
});
