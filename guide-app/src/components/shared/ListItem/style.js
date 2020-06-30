import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  titleContainer: { flex: 1, padding: 15 },
  title: {
    ...TextStyles.title,
    ...TextStyles.defaultFontFamily,
    color: Colors.black,
  },
  imageContainer: {
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
  },
  description: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      color: Colors.black,
    },
  ]),
  date: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      color: Colors.gray3,
    },
  ]),
  forKidsText: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      paddingHorizontal: 5,
      color: Colors.gray2,
    },
  ]),
  checkedContainer: {
    flex: 1,
    flexDirection: "row",
  },
});
