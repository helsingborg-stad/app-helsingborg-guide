import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({

  settings: {
    position: "relative",
    backgroundColor: "#F8F8F8",
    maxWidth: Dimensions.get("window").width,
    paddingHorizontal: 16,
    overflow: "hidden",
    zIndex: 1,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "visible"

  },

  wrapper: {
    position: "relative"
  },

  search: {},

  searchTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },

  searchTopLeft: {
    fontSize: 22,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#292929"
  },

  searchTopRight: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Roboto",
    color: "#292929",
    opacity: 0.8,
  },

  forChildren: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },

  forChildrenText: {
    paddingLeft: 6
  },

  searchBottom: {
    marginBottom: 24
  },

  distance: {
    marginBottom: 20
  },

  distanceText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#292929",
  },

  distanceValues: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: -10
  },

  distanceValue: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16
  },

  toggleSettings: {
    position: "absolute",
    minWidth: 30,
    height: 35,
    borderRadius: 15,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3f3f3f",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  toggleSettingsText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Roboto",
    paddingLeft: 5,
    letterSpacing: 0.91,
  },

});

export default styles;
