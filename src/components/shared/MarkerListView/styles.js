import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export const TextMargin = 10;
export const ListItemImageSize = 120;
export const DefaultMargin = 20;

export const ScreenWidth = Dimensions.get("window").width;
export const ScreenHeight = Dimensions.get("window").height;
export const ListItemWidth = ScreenWidth - DefaultMargin * 2;

const ios = Platform.OS === "ios";

/*
 * Shared style constants
 */

const listItemShared = {
  backgroundColor: Colors.white,
  flexDirection: "row",
  height: ListItemImageSize,
  width: ListItemWidth,
  marginVertical: DefaultMargin / 2,
  elevation: 4,
  shadowColor: "rgba(0, 0, 0, 0.23)",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 5,
  shadowOpacity: 1,
};

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  guideNumberText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      fontWeight: "500",
      marginRight: TextMargin,
      color: Colors.purple,
    },
  ]),
  listButton: {
    bottom: ListItemImageSize + DefaultMargin,
    position: "absolute",
    right: 0,
    zIndex: 100,
  },
  listIcon: {
    height: 60,
    width: 60,
  },
  listImage: {
    height: ListItemImageSize,
    width: ListItemImageSize,
  },
  listImageNumberText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.black,
      marginTop: 1,
      fontSize: 18,
      letterSpacing: -2.0,
      left: ios ? -1 : 0,
      fontWeight: "500",
      textAlign: "center",
      backgroundColor: "transparent",
    },
  ]),
  listImageNumberView: {
    backgroundColor: Colors.white,
    borderRadius: 13,
    height: 26,
    left: 5,
    position: "absolute",
    top: 5,
    width: 26,
  },
  listItem: {
    ...listItemShared,
    marginHorizontal: 5,
  },
  listItemAddress: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      marginTop: 4,
      lineHeight: 21,
      marginRight: TextMargin,
      color: Colors.warmGrey,
    },
  ]),
  listItemTextContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: TextMargin,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.black,
      marginTop: 8,
      flexWrap: "wrap",
      fontSize: 20,
      fontWeight: "500",
      lineHeight: 23.0,
      letterSpacing: 0.1,
      marginRight: TextMargin,
    },
  ]),
  listStyle: {
    backgroundColor: Colors.transparent,
    bottom: 14,
    height: ListItemImageSize + DefaultMargin,
    left: 0,
    position: "absolute",
    right: 0,
  },
  map: {
    flex: 1,
  },
});
