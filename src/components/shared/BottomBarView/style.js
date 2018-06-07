import { StyleSheet } from "react-native";
import { Colors } from "../../../styles";

export default StyleSheet.create({
  viewContainer: {
    height: 80,
    justifyContent: "center",
    backgroundColor: Colors.darkPurple,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  imageTab: {
    width: "33.333333%",
    flex: 0,
    alignSelf: "center",
  },
  buttonTabContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: -38,
    zIndex: -2,

  },
  iconContainer: {
    position: "absolute",
    top: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});
