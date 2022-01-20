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
    flexDirection: "column",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
  },
  eventImage: {
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

  title: {},

  dateContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#a84c98",
    marginTop: 15,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateTextDay: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  dateTextMonth: {
    color: "white",
    fontSize: 12,
  },
  titleWrapper: {
    paddingHorizontal: 34,
    paddingTop: 12,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    marginTop: "auto",
    flex: 1,
    justifyContent: "center",
    height: 60,
  },

  titleText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 30,
      color: "#7b075e",
    },
  ]),

  location: {
    flex: 1,
    marginHorizontal: 34,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 46,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.listBackgroundColor,
  },

  timeContainer: {
    flexDirection: "row",
  },
  timeTextContainer: {
    flexDirection: 'column',
  },

  timeText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      lineHeight: 21,
      color:'black'
    },
  ]),
  timeTextTop: {

  },
  timeTextBottom: {
    color:'black',
    fontWeight: '700',
    fontSize: 16,
  },

  locationContainer: {
    flexDirection: "row",
  },
  locationTextContainer:{
    flexDirection: 'column',
  },

  locationText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      lineHeight: 21,
      color:'black'
    },
  ]),
  locationTextTop: {

  },
  locationTextBottom: {
    color:'black',
    fontWeight: '700',
    fontSize: 16,
  },

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
    marginTop: "auto",
    justifyContent: "flex-end",
    marginBottom: 50,
  },
  navGuideWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    width: "100%",
  },
});
