import { StyleSheet } from "react-native";
import { Colors } from "../../../styles";
import { StyleSheetUtils } from "../../../utils/";


export default StyleSheet.create({
  viewContainer: {
    flex: 0.12,
    justifyContent: "center",
    // alignItems: "stretch",
    backgroundColor: "#00000000",
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
    top: -20,
    zIndex: -2,

  },
  iconContainer: {
    position: "absolute",
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  icon: {
    flex: 1,
    alignSelf: "center",
    height: 30,
    width: 30,

  },

});
