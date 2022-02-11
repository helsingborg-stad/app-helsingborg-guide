import { StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white
  },
  innerContainer: { flex: 1, position: "relative" },
  downloadButton: {
    width: "100%"
  },
  overlayStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.transparent
  }
});
