import { StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

export default StyleSheet.create({
  container: {
    padding: "4%",
    backgroundColor: Colors.white,
    height: "100%"
  },
  footer: {
    paddingVertical: 10
  },
  mapButton: {
    position: "absolute",
    right: -5,
    bottom: "2%"
  },
  mapIcon: {
    width: 90,
    height: 90
  },
  barButtonItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.75,
    paddingHorizontal: 14,
    color: Colors.white
  }
});
