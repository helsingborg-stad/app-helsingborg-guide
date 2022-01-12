import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },

  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",

  },
  scrollView: {
    paddingBottom: 70,
  },
  titleContainer: {
    flex: 2,
    paddingHorizontal: 34,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 24,
      fontWeight: "300",
      lineHeight: 30,
    },
  ]),
  idContainer: {
    flex: 1,
    paddingHorizontal: 34,
    paddingBottom: 4,
  },
  idText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 21,
      color: Colors.gray3,
    },
  ]),
  articleContainer: {
    flex: 4,
    display: "flex",
    paddingHorizontal: 34,
    paddingVertical: 10,

  },
  article: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  shareBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 50,
  },
  navGuideContainer: {
    bottom: 0,
    marginTop: 'auto',
    justifyContent: "flex-end",
    marginBottom: 50
  },
  navGuideWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    width: "100%",
  },
});
