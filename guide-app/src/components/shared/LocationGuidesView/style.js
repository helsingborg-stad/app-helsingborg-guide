import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  guideListHeaderText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 20,
      lineHeight: 21,
      paddingVertical: 10,
      color: Colors.black
    }
  ]),
  guideListContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20

  },
  guideContainer: {
    backgroundColor: Colors.white,
    minHeight: 160,
    justifyContent: "center",
    elevation: 8,
    marginVertical: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 10,

  }
});
