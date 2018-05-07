import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../../../styles/";
import { StyleSheetUtils } from "../../../utils/";

export default StyleSheet.create({
  titleContainer: { flex: 1, padding: 15 },
  title: StyleSheetUtils.flatten([
    TextStyles.title, {
      color: Colors.black,
    }],
  ),
  imageContainer:
    {
      width: "100%",
      height: "auto",
      aspectRatio: 16 / 9,
    },
  description: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.black,
    }],
  ),
  date: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.warmGrey,
    }],
  ),
  forKidsText: StyleSheetUtils.flatten([
    TextStyles.description, {
      paddingHorizontal: 5,
      color: Colors.darkGrey,
    }],
  ),

  checkedContainer: {
    flex: 1,
    flexDirection: "row",
  },
});
