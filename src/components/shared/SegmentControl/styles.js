import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.purple,
    flexDirection: "row",
    height: 44,
    justifyContent: "center",
    width: "100%",
  },
  segmentItem: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  segmentLabel: {
    ...TextStyles.segmentControlLabel,
  },
  segmentLabelSelected: {
    ...TextStyles.segmentControlLabel,
    fontWeight: "800",
  },
});
