import { StyleSheet } from "react-native";
import { Colors } from "../../../styles";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  headerContainer: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  closeButton: {
    backgroundColor: Colors.darkPurple,
  },
  titleContainer: {
    flex: 8,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 18,
    lineHeight: 30,
  },
  padContainer: { flex: 1 },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  digitContainer: {
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    margin: 1,
  },
  upperDigitContainer: {
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  rowItem: {
    flex: 1,
  },
  doubleRowItem: {
    flex: 2,
  },
  digitText: {
    fontSize: 48,
    lineHeight: 57,
    fontWeight: "300",
    color: "#999999",
  },
  disabled: {
    backgroundColor: "#f8f8f8",
  },
  disabledText: {
    color: "#d9d9d9",
  },
  darkText: {
    color: Colors.black,
  },
});
