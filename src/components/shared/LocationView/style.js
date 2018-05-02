import { StyleSheet, Dimensions } from "react-native";
import {
  Colors,
  TextStyles,
} from "../../../styles/";
import { StyleSheetUtils } from "../../../utils/";

const displayWidth = Dimensions.get("window").width;
const displayHeight = (displayWidth / 16) * 9;
const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.65;

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
    width: displayWidth,
    height: displayHeight,
    maxHeight: MAX_IMAGE_HEIGHT,
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
  pointPropertiesSectionContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    paddingBottom: 20,
  },
  pointPropertyContainer: {
    flex: 0,
    flexDirection: "row",
    flexGrow: 1,
    width: "40%",
    paddingTop: 8,
    alignItems: "center",
  },
  pointPropertyText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 24.0,
      paddingLeft: 9,
      color: Colors.warmGrey,
    }],
  ),
  divider: {
    height: 2,
    backgroundColor: Colors.listBackgroundColor,
    marginTop: 30,
  },
  pointPropertyIcon: {
    width: 30,
    height: 30,
  },
});
