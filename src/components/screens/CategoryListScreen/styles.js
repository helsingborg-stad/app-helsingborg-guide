import { StyleSheet } from "react-native";
import { Colors } from "../../../styles";

export default StyleSheet.create({
  container: {
    padding: "4%",
    backgroundColor: Colors.white,
  },
  mapButton: {
    position: "absolute",
    right: 0,
    bottom: "2%",
  },
  mapIcon: {
    width: 60,
    height: 60,
  },
});
