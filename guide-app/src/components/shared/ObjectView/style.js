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
    overflow: 'hidden',

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
    justifyContent: "flex-end",
    zIndex: 100,
    backgroundColor: 'white',
    marginTop: 20,

  },
  navGuideWrapper: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  navGuide: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },

  navGuideBarWrapper: {
    width: '60%',
    flexDirection: 'column',
  },
  navGuideBarStep: {
    textAlign: 'center',
  },

  navGuideBar: {
    height: 29,
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
  },

  navGuideBarFilled: {
    height: '100%',
    backgroundColor: '#711A5B',
    borderRadius: 20,
  },
});
