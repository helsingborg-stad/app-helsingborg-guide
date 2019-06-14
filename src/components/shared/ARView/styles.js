// @flow

import { StyleSheet, Dimensions } from "react-native";
import { Colors, TextStyles } from "../../../styles";
import { StyleSheetUtils } from "../../../utils";

export const ScreenWidth = Dimensions.get("window").width;

const ButtonWidth = ScreenWidth - 60;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  goToSettingsButton: {
    alignItems: "center",
    backgroundColor: Colors.purple,
    borderRadius: 5,
    flexDirection: "row",
    height: 45,
    justifyContent: "center",
    marginBottom: 40,
    marginHorizontal: 40,
    marginTop: 20,
    paddingHorizontal: 40,
    textAlign: "center",
    width: ButtonWidth,
  },
  goToSettingsButtonText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.white,
    },
  ]),
  unsupportedContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  unsupportedText: {
    ...TextStyles.medium,
  },
});
