import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white
  },
  scrollView: {},
  imageViewContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  comingSoonView: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: Colors.themeTertiary
  },
  comingSoonText: StyleSheetUtils.flatten([
    TextStyles.comingSoonText,
    {
      color: Colors.white
    }
  ]),
  imageBackground: {
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9
  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 20

  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 30,
      textAlign: "center",
      color: Colors.black
    }
  ]),
  openingHoursAndDistanceContainer: {
    flex: 1,
    paddingVertical: 4
  },
  distanceText: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      fontWeight: "400",
      color: Colors.gray3,
      textAlign: "left"
    }
  ]),
  articleContainer: {
    width: '100%',
    flex: 4,
    paddingTop: 20,
    paddingBottom: 5,
    backgroundColor: 'rgba(248, 248, 248, 1)',
    paddingHorizontal: 20
  },
  articleDescriptionText: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      color: Colors.gray3
    }
  ]),
  articleHeaderText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 20,
      paddingBottom: 10,
      color: Colors.black,
      fontWeight: "600",
    }
  ]),
  infoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  directionsText: {
    paddingLeft: 5,
  },
});
