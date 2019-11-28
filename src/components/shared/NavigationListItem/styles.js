import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export default StyleSheet.create({
  imageWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  listItemContainer: {
    borderRadius: 2,
    elevation: 3,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 20
  },
  listItemGuideCount: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.warmGrey
    }
  ]),
  listItemImage: {
    height: "auto",
    width: "100%",
    aspectRatio: 339 / 154
  },
  listItemTextContainer: {
    padding: 8
  },
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "normal",
      color: Colors.black
    }
  ]),
  extrasContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  forChildrenContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  forChildrenText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.warmGrey
    }
  ]),
  forChildrenIcon: {
    marginLeft: 4,
    width: 20,
    height: 20
  }
});
