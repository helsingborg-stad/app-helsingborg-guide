import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export const TextMargin = 18;
export const ListItemImageSize = 100;
export const DefaultMargin = 20;

export const ScreenWidth = Dimensions.get("window").width;
export const ScreenHeight = Dimensions.get("window").height;
export const ListItemWidth = ScreenWidth - DefaultMargin * 2;
export const ListHeight = ListItemImageSize + DefaultMargin;
export const ListBottomMargin = 14;

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

const listImageNumberViewShared = {
  alignItems: "center",
  borderRadius: 11,
  flexDirection: "row",
  height: 22,
  justifyContent: "center",
  width: 22,
};

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  guideNumberText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 13,
      marginRight: TextMargin,
      color: Colors.themePrimary,
    },
  ]),
  listButton: {
    bottom: ListItemImageSize + DefaultMargin,
    position: "absolute",
    right: 0,
    zIndex: 100,
  },
  listContainerStyle: {
    paddingHorizontal: ios ? 0 : 15,
  },
  listEstimatesContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  listEstimatesDistance: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 24,
      fontWeight: "bold",
      color: Colors.black,
    },
  ]),
  listEstimatesTime: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 24,
      fontWeight: "normal",
    },
  ]),
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
      color: Colors.white,
      fontSize: 12,
      letterSpacing: -2.0,
      left: ios ? -1 : 0,
      flex: 1,
      fontWeight: "500",
      textAlign: "center",
      backgroundColor: "transparent",
    },
  ]),
  listImageNumberView: {
    ...listImageNumberViewShared,
    backgroundColor: Colors.themePrimary,
  },
  listImageNumberViewArrived: {
    ...listImageNumberViewShared,
    backgroundColor: Colors.green,
  },
  listItem: {
    ...listItemShared,
    borderRadius: 5,
    marginHorizontal: 5,
    overflow: "hidden",
  },
  listItemAddress: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 10,
      marginRight: TextMargin,
      color: Colors.gray3,
    },
  ]),
  listItemTextContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: TextMargin,
    marginBottom: 14,
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.black,
      fontSize: 13,
      fontWeight: "bold",
      letterSpacing: 0.08,
      marginRight: TextMargin,
    },
  ]),
  listItemTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  listStyle: {
    backgroundColor: Colors.transparent,
    bottom: ListBottomMargin,
    height: ListHeight,
    left: 0,
    position: "absolute",
    right: 0,
  },
  map: {
    flex: 1,
  },
  segmentControl: {
    left: 0,
    opacity: 0.8,
    position: "absolute",
    top: 0,
    width: ScreenWidth,
    zIndex: 500,
  },
});
