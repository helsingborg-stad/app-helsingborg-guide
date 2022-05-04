import { Platform, StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({

  homeContainer: {
    height: "100%",
    overflow: "hidden",
    zIndex: 5,
    backgroundColor: "#FCFCFC",
  },

  viewContainer: {
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white
  },
  container: {
    backgroundColor: "#FCFCFC",
    height: "100%",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100
  },

  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 22,
      marginTop: 25,
      marginBottom: 10,
      fontWeight: '500',
      color: "rgba(41, 41, 41, 1)"
    },
  ]),

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
      ...TextStyles.bold,
      fontStyle: "normal",
      letterSpacing: 1,
      color: Colors.white
    }
  ]),
  sectionTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 32,
      ...TextStyles.bold,
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
    zIndex: 3,
    backgroundColor: "#F8F8F8",
    ...Platform.select({
      android: {
        paddingTop: 16
      }
    }),
    paddingBottom: 16,
  },
  mapButton: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    bottom: 0,
    marginRight: 15,
    marginBottom: 18,
    width: 58,
    height: 58,
    borderRadius: 58,
    backgroundColor: Colors.themeSecondary,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 7
  },
  circle: {},
  mapIcon: {
    width: 19,
    height: 24
  },

  backDrop: {
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
  },

  backDropDismiss: {
    flex: 1,

  }

});
