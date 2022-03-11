import { StyleSheet, Dimensions } from "react-native";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minWidth: fullWidth,
    maxWidth: fullWidth,
    alignSelf: "center",
    paddingVertical: 10,
    overflow: "visible",
  },

  scroll: {
    margin: 0,
    padding: 0,
    minWidth: fullWidth,
    maxWidth: fullWidth,
  },

  scrollcontainer: {
    margin: 0,
    padding: 0,
    minWidth: fullWidth,
    maxWidth: fullWidth,
    alignContent: "center",
    alignItems: "center",
  },

  touchable: {
  },

  safearea: {
    flex: 1,
    backgroundColor: "white",
  },

  top: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },

  close: {
    flex: 1,
  },

  filterSettings: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "500",
    color: "#2C2C2C",
    textAlign: "center",
    flexWrap: "wrap",

  },

  reset: {
    flex: 1,
    textAlign: "right",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  resetText: {
    fontFamily: "Roboto",
    fontWeight: "500",
    color: "#A71580",
    fontSize: 16,
  },

  filterButtons: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  filterButton: {
    height: 55,
    backgroundColor: "#EBEBEB",
    width: (fullWidth / 2) - 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  filterButtonText: {
    fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 16,
  },

  selected: {
    backgroundColor: "#A40082",
  },

  selectedText: {
    color: "white",
  },
  buttonsTop: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  buttonsTitle: {
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 18,
    paddingLeft: 20,
    textAlign: "left",
    alignSelf: "flex-start",
  },

  buttonsMain: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },


  filterDropdown: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 20,
  },

  seperator: {
    height: 0.5,
    marginTop: 10,
    backgroundColor: "#2C2C2C2E",
    width: fullWidth,
    justifyContent: "center",
    overflow: "visible",
  },

  filterDetails: {

  },

  sectionHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
  },

  sectionHeaderText: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "500",
    color: "#2C2C2C",
    paddingRight: 8,
  },

  details: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailsLeft: {

  },

  detailsRight: {

  },

  switch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  switchText: {
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "400",
    color: "#262626",
    paddingLeft: 9,
  },

  bold: {
    fontWeight: "600",
  },

  time: {
    paddingHorizontal: 20,
  },

  intervals: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  intervalItem: {
    flexDirection: "column",
    alignItems: "center",
    maxWidth: (fullWidth / 3) - 25,
    minWidth: (fullWidth / 3) - 25,
  },

  intervalTextContainer:  {
    justifyContent: "center",
    alignItems: "center",
  },

  timePrefix: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: "#262626",

  },

  timeDate: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: "#262626",
  },


  calendar: {
  marginTop: 40,
  }

});

export default styles;
