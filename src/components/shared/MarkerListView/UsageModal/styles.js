import { StyleSheet, Dimensions } from "react-native";
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
    justifyContent: "space-between",
  },
  illustrationImageContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
    paddingLeft: 127,
    paddingRight: 53,
    paddingTop: 40,
  },
  instructions: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      letterSpacing: 0.09,
      lineHeight: 23,
      marginHorizontal: 30,
      textAlign: "center",
    },
  ]),
  marker: {
    alignItems: "center",
    flexDirection: "row",
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 193,
    top: 100,
    width: 20,
  },
  markerNumber: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.white,
      fontSize: 9,
      letterSpacing: 0,
      lineHeight: 13,
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
