import { StyleSheet, Platform } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

const ios = Platform.OS === "ios";

const markerImageActiveWidth = 42;
const markerImageInactiveWidth = 32;

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },
  map: {
    flex: 1
  },
  numberedMarkerText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      position: "absolute",
      width: markerImageInactiveWidth,
      top: ios ? 6 : 3,
      left: ios ? -1 : -2,
      fontSize: ios ? 18 : 16,
      letterSpacing: -2.0,
      fontWeight: "500",
      lineHeight: 23.0,
      textAlign: "center",
      color: Colors.white
    }
  ]),
  numberedMarkerTextActive: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      position: "absolute",
      width: markerImageActiveWidth,
      top: ios ? 9 : 7,
      left: ios ? -1 : -3,
      fontSize: 18,
      letterSpacing: -2.0,
      fontWeight: "500",
      lineHeight: 23.0,
      textAlign: "center",
      color: Colors.black
    }
  ])
});
