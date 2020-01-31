import { Platform, StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100
  },
  barButtonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.75,
    paddingHorizontal: 14
  },
  barButtonImage: {
    maxHeight: 44,
    maxWidth: 44
  },
  loadingSpinner: {
    height: "100%",
    width: "100%"
  },
  sectionContainer: {
    paddingVertical: 20
  },
  sectionFooterContainer: {
    width: "100%",
    paddingBottom: "6%"
  },
  sectionFooterButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 45,
    backgroundColor: Colors.themeControl
  },
  sectionNoContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6
  },
  sectionNoContentText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      color: Colors.black26,
      fontWeight: "500",
      fontSize: 19,
      lineHeight: 22,
      textAlign: "center",
      width: "50%"
    }
  ]),
  sectionFooterText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 15,
      fontWeight: "bold",
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.white
    }
  ]),
  sectionTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 32,
      fontWeight: "bold",
      fontStyle: "normal",
      color: Colors.black
    }
  ]),
  sectionDescription: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      color: Colors.gray1
    }
  ]),
  sectionLoadingSpinner: {
    padding: 20
  },
  topBarNavigation: {
    ...Platform.select({
      android: {
        paddingTop: 16
      }
    }),
    paddingBottom: 16
  },
  mapButton: {
    position: "absolute",
    right: -5,
    bottom: "2%"
  },
  mapIcon: {
    width: 90,
    height: 90
  }
});
