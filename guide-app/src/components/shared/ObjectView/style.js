import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";


export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: Colors.white,
    overflow: "visible"
  },

  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    flex: 1
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9
  },
  bodyContainer: {
    minHeight: "100%",
    flex: 1,
    alignItems: "stretch"
  },
  scrollView: {
    paddingBottom: 70,
    flex: 1
  },
  infoContainer: {
    flexDirection: "row",
    paddingVertical: 20,
  },

  titleWrapper: {
    flex: 2,
    justifyContent: "center",
  },

  titleContainer: {
    paddingHorizontal: 20,
  },

  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 20,
      fontWeight: "400",
      lineHeight: 25
    }
  ]),
  idContainer: {
    paddingHorizontal: 20,
  },
  idText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 22,
      color: Colors.themeSecondary
    }
  ]),
  articleContainer: {
    flex: 4,
    display: "flex",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(248, 248, 248, 1)',
  },
  article: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  },
  shareBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 50
  },
  navGuideContainer: {
    justifyContent: "flex-end",
    zIndex: 100,
    backgroundColor: "white",
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
    width: "100%"
  },

  navGuideBarWrapper: {
    width: "60%",
    flexDirection: "column"
  },
  navGuideBarStep: {
    textAlign: "center"
  },

  navGuideBar: {
    height: 29,
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    overflow: "hidden"
  },

  navGuideBarFilled: {
    height: "100%",
    width: "100%",
    backgroundColor: "#711A5B",
    borderRadius: 20,
    overflow: "hidden"
  }
});
