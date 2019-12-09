import { StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    backgroundColor: Colors.white
  },
  headerContainer: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center"
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15
  },
  closeButton: {
    backgroundColor: Colors.themeSecondary
  },
  titleContainer: {
    flex: 8,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 15
  },
  titleText: {
    fontSize: 18,
    lineHeight: 30
  },
  padContainer: { flex: 1 },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  digitContainer: {
    backgroundColor: Colors.grey2,
    alignItems: "center",
    justifyContent: "center",
    margin: 1
  },
  upperDigitContainer: {
    backgroundColor: Colors.grey2,
    alignItems: "center",
    justifyContent: "center"
  },
  rowItem: {
    flex: 1
  },
  doubleRowItem: {
    flex: 2
  },
  digitText: {
    fontSize: 48,
    lineHeight: 57,
    fontWeight: "300",
    color: Colors.grey3
  },
  disabled: {
    backgroundColor: Colors.grey4
  },
  disabledText: {
    color: Colors.grey5
  },
  darkText: {
    color: Colors.black
  }
});
