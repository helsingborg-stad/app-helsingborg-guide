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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.gray11,
    alignItems: "center",
    justifyContent: "center",
    margin: 1
  },
  upperDigitContainer: {
    backgroundColor: Colors.gray11,
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
    color: Colors.gray4
  },
  disabled: {
    backgroundColor: Colors.gray12
  },
  disabledText: {
    color: Colors.gray9
  },
  darkText: {
    color: Colors.black
  }
});
