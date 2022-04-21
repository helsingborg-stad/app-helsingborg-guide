import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({

  itemContainer: {
    position: 'relative',
  },

  titleContainer: {
    flex: 1,
    padding: 15,
    marginTop: -50,
    zIndex: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    ...TextStyles.title,
    ...TextStyles.defaultFontFamily,
    color: Colors.black,
  },
  imageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
  },
  description: StyleSheetUtils.flatten([
    TextStyles.descriptionSpaced,
    {
      paddingTop: 5,
      color: Colors.gray2,
      textTransform: 'uppercase',
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

  forKidsContainer: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 3
  },
  quizContainer: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 40,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 3,
  }
});
