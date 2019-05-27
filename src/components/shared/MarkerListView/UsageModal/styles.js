import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, TextStyles } from "../../../../styles";
import { StyleSheetUtils } from "../../../../utils";

export const ScreenWidth = Dimensions.get("window").width;
export const ScreenHeight = Dimensions.get("window").height;

const ButtonWidth = ScreenWidth - 60;

export default StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
  exampleImage: {
    backgroundColor: Colors.lightGrey,
    height: 231,
    marginLeft: 127,
    width: 195,
  },
  exampleImageContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
  },
  instructions: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      marginHorizontal: 30,
      letterSpacing: 0.09,
      lineHeight: 36,
      textAlign: "center",
    },
  ]),
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
      marginHorizontal: 70,
      marginTop: 70,
      textAlign: "center",
    },
  ]),
});
