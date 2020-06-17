import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";

// @TODO clean up styles, add colors to Colors.

export default StyleSheet.create({
  container: {
    alignItems: "center",
    // backgroundColor: Colors.offWhite4,
    backgroundColor: "#76768012",
    borderRadius: 70,
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 16,
    padding: 2,
  },
  pillContainer: {
    flexGrow: 1,
    flexBasis: 0,
  },
  pill: {
    borderRadius: 70,
    borderWidth: 0.5,
    borderColor: Colors.transparent,
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 5,
  },
  pillActive: {
    borderColor: "#00000004",
    backgroundColor: Colors.themeSecondary,

    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  label: {
    ...TextStyles.segmentControlPillLabel,
    color: Colors.black,
  },
  labelActive: {
    ...TextStyles.segmentControlPillLabel,
    fontWeight: "500",
    color: Colors.white,
  },
});
