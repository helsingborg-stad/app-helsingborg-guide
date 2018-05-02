import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../../../styles/";
import { StyleSheetUtils } from "../../../utils/";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  scrollView: {},
  imageViewContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  comingSoonView: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    zIndex: 100,
    left: 0,
    backgroundColor: Colors.lightPurple,
  },
  comingSoonText: StyleSheetUtils.flatten([
    TextStyles.comingSoonText, {
      color: Colors.white,
    }]),
  imageBackground: {
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
    zIndex: 1000,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 30,
      textAlign: "center",
      color: Colors.black,
    }],
  ),
  openTimeContainer: {
    flex: 1,
    paddingVertical: 4,
  },
  openTimeText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "normal",
      lineHeight: 19,
      color: Colors.black,
    }],
  ),
  distanceText: StyleSheetUtils.flatten([
    TextStyles.description, {
      fontWeight: "400",
      color: Colors.warmGrey,
      textAlign: "left",
    }],
  ),
  articleContainer: {
    flex: 4,
    paddingTop: 10,
    paddingBottom: 5,
  },
  articleDescriptionText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.warmGrey,
    }],
  ),
  articleHeaderText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 20,
      lineHeight: 21,
      paddingBottom: 10,
      color: Colors.black,
    }],
  ),
});
