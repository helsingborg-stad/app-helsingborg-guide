import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  pointPropertiesSectionContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    paddingBottom: 20
  },
  pointPropertyContainer: {
    flex: 0,
    flexDirection: "row",
    flexGrow: 1,
    width: "40%",
    paddingTop: 8,
    alignItems: "center"
  },
  pointPropertyText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 24.0,
      paddingLeft: 9,
      color: Colors.gray3
    }
  ]),
  divider: {
    height: 2,
    backgroundColor: Colors.listBackgroundColor,
    marginTop: 30
  },
  pointPropertyIcon: {
    width: 30,
    height: 30
  }
});
