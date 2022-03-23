import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: Colors.white
  },

  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column"
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9
  },
  eventImage: {
    flex: 1,
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9
  },

  bodyContainer: {
    flex: 1,
    alignItems: "stretch"

  },
  scrollView: {
    paddingBottom: 70
  },

  title: {},

  dateContainer: {
    minWidth: 60,
    minHeight: 60,
    backgroundColor: "#a84c98",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  dateTextDay: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  },
  dateTextMonth: {
    color: "white",
    fontSize: 12
  },
  titleWrapper: {
    paddingHorizontal: 34,
    paddingTop: 12,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center"
  },
  titleContainer: {
    marginTop: "auto",
    justifyContent: "center",
    minHeight: 60,
    overflow: "visible",
    marginLeft: 12,
    flex: 1
  },

  titleText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 20,
      fontWeight: "700",
      lineHeight: 30,
      color: "#7b075e"
    }
  ]),

  location: {
    flex: 1,
    marginHorizontal: 34,
    paddingVertical: 15,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 46,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.listBackgroundColor
  },

  timeContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center"
  },

  timeIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },

  timeTextContainer: {
    flexDirection: "column"
  },

  timeText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      lineHeight: 21,
      color: "black"
    }
  ]),
  timeTextTop: {},
  timeTextBottom: {
    color: "black",
    fontWeight: "700",
    fontSize: 14
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 10

  },

  locationTextContainer: {
    flexDirection: "column",
    textAlign: "left"
  },

  locationText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      lineHeight: 20,
      color: "black",
      textAlign: "left"
    }
  ]),
  locationTextTop: {},
  locationTextBottom: {
    color: "black",
    fontWeight: "700",
    fontSize: 14
  },

  articleContainer: {
    flex: 4,
    display: "flex",
    paddingHorizontal: 34,
    paddingTop: 10
  },

  article: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  bookingButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 35,
    marginLeft: 34,
    backgroundColor: "#a84c98",
    borderRadius: 6,

  },

  bookingButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },

  infoContainer: {
    marginBottom: 50,
  },

  sectionHeader: {
    flexDirection: "row",
    paddingHorizontal: 34,
    marginVertical: 15,
    alignItems: "center",
  },

  sectionHeaderText: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "500",
    color: "#2C2C2C",
    paddingRight: 8
  },

  sectionContent: {
    paddingHorizontal: 34
  },

  shareBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 50
  },
  navGuideContainer: {
    bottom: 0,
    marginTop: "auto",
    justifyContent: "flex-end",
    marginBottom: 50
  },
  navGuideWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    width: "100%"
  },

  locationTitle: {
    fontWeight: "700",
    paddingVertical: 5,

  },

  locationStreetAddress: {
    paddingVertical: 5
  },

  locationCity: {
    paddingVertical: 5
  },

  locationPostal: {
    paddingVertical: 5
  },


  organizerItem: {
    flexDirection: "row",
    alignItems: "center"
  },

  organizerName: {
    fontWeight: "700",
    paddingVertical: 5
  },

  organizerPhone: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 5,
    textDecorationLine: "underline"

  },

  organizerEmail: {
    paddingVertical: 5,
    paddingLeft: 5,
    textDecorationLine: "underline"
  },

  organizerLink: {
    paddingVertical: 5,
    paddingLeft: 5,
    textDecorationLine: "underline"
  },

  informationItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  informationLink: {
    paddingLeft: 5,
    paddingVertical: 5,
    textDecorationLine: "underline",
  }

});
