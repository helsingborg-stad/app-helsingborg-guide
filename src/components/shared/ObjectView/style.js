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
  titleContainer: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 24,
      fontWeight: "300",
      lineHeight: 30,
    }],
  ),
  idContainer: {
    flex: 1,
    paddingHorizontal: 34,
    paddingBottom: 4,
  },
  idText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 21,
      color: Colors.warmGrey,
    }],
  ),
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
