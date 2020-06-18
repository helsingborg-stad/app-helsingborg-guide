import { StyleSheet } from "react-native";
import { TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  illustrationImageContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
    paddingLeft: 127,
    paddingRight: 53,
  },
  instructions: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      letterSpacing: 0.09,
      lineHeight: 23,
      marginHorizontal: 40,
      textAlign: "center",
      paddingTop: 20,
    },
  ]),
  marker: {
    alignItems: "center",
    flexDirection: "row",
    height: 33,
    justifyContent: "center",
    position: "absolute",
    right: 136,
    top: 60,
    width: 28,
  },
  mobileHandContainer: {
    right: 50,
  },
  speechBubble: {
    alignItems: "center",
    flexDirection: "row",
    height: 110,
    justifyContent: "center",
    paddingHorizontal: 10,
    position: "absolute",
    right: 60,

    width: 112,
  },
  speechBubbleText: {
    ...TextStyles.medium,
    ...TextStyles.bold,
    textAlign: "center",
  },
});
