import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({

  settings: {
    position: "absolute",
    flex: 1,
    backgroundColor: '#F0F0F0',
    maxWidth: Dimensions.get("window").width,
    paddingHorizontal: 16,
    overflow: "hidden",
    zIndex: 1,
  },

  wrapper: {
    position: "relative",
  },

  search: {

  },

  searchTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },

  searchTopLeft: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: "#292929",
  },

  searchTopRight: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: "#292929",
    opacity: 0.8,
  },

  searchBottom: {
    marginBottom: 24,
  },

  distance: {
  marginBottom: 28,
  },

  distanceText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#292929",
    paddingBottom: 6,
  },

  distanceValues: {
    flexDirection: "row",
    width: '100%',
    justifyContent: "space-between",

  },

  distanceValue: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
  },

  toggleSettings: {
    position: "absolute",
    minWidth: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 5,
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


})

export default styles;
