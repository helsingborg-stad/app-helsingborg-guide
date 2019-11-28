import { StyleSheet } from "react-native";
import { Colors } from "../../../styles";

export default StyleSheet.create({
  viewContainer: {
    height: 68,
    justifyContent: "center",
    backgroundColor: Colors.darkPurple
  },
  imageBackground: {
    width: "100%",
    height: "100%"
  },
  imageTab: {
    flex: 1,
    height: "100%"
  },
  buttonTabContainer: {
    position: "absolute",
    flexDirection: "row",
    top: -16,
    bottom: 68,
    left: 0,
    right: 0
  },
  iconContainer: {
    position: "absolute",
    top: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});
