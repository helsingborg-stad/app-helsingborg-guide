// @flow

import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

export default StyleSheet.create({
  text: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      color: Colors.warmGrey
    }
  ])
});
