import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../../../styles/";
import { StyleSheetUtils } from "../../../utils/";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  scrollView: {
    paddingBottom: 70,
  },
  articleContainer: {
    flex: 4,
    paddingHorizontal: 34,
    paddingVertical: 10,
  },
  article: {
    fontSize: 14,
    lineHeight: 20,
  },

});
