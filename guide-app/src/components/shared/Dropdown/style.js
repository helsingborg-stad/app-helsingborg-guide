import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    position: "relative",
    flexDirection: "column",
    overflow: 'visible',
  },

  title: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    paddingBottom: 7,
  },

  select: {
    flexDirection: 'row',
    justifyContent: "space-between",
    width: 177,
    height: 27,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 5,
    overflow: 'visible',
    alignItems: "center",
    alignContent: "center",

  },

  placeholder: {
    paddingLeft: 10,
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 12,
    color: "#2C2C2C",
    opacity: 0.8,
  },

  clickable: {},

  arrow: {
    paddingRight: 10,
    justifySelf: "center",
  },

  options: {
    minHeight: 50,
    maxHeight: 180,
    width: 177,
    zIndex: 20,
    shadowColor: "#8a8a8a",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    backgroundColor: 'white',
    padding: 10,
  },

  scroll: {
  },

  item: {
      flexDirection: "row",
      alignItems: "center",
  },

  itemText: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "400",
    color: "#262626",
    maxWidth: "70%",
  },

  bold: {
    fontWeight: "600",
  },

});

export default styles;
