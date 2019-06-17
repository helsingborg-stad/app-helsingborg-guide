import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "../../../styles";

export const SegmentControlHeight = 54;

export default StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.darkPurple,
    flexDirection: "row",
    height: SegmentControlHeight,
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
    opacity: 0.5,
  },
  segmentLabelSelected: {
    ...TextStyles.segmentControlLabel,
    opacity: 1,
  },
  selectionView: {
    backgroundColor: Colors.white,
    bottom: 0,
    height: 4,
    left: 0,
    position: "absolute",
  },
});
