import { StyleSheet, Dimensions } from "react-native";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: fullWidth,
    height: fullHeight,
    alignSelf: "center",
    paddingVertical: 10,
    overflow: "visible",
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
    marginTop: 24,
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
    alignItems: "center",
  },

  buttonsMain: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
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
    paddingRight: 5,
  },

  details: {
    paddingHorizontal: 20,
  },

  time: {
    paddingHorizontal: 20,
  },

});

export default styles;
