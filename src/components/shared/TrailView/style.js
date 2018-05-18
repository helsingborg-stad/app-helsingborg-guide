import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../../../styles/";
import { StyleSheetUtils } from "../../../utils/";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
  },
  overlayStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.transparent,
  },
});
