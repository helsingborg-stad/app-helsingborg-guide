import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  filter: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 16,
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

  },

  distanceText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#292929",
    paddingBottom: 8,


  }

})

export default styles;
