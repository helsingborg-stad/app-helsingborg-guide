import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "../../../styles";

// Sorry /Björn
export const isIphoneX = () => {
  const d = Dimensions.get("window");
  const { height, width } = d;

  return (
    Platform.OS === "ios" &&
    (height === 812 || width === 812)
  );
};

export default StyleSheet.create({
  viewContainer: {
    height: isIphoneX() ? 80 : 68,
    justifyContent: "center",
    backgroundColor: Colors.darkPurple,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  imageTab: {
    flex: 1,
    height: "100%",
  },
  buttonTabContainer: {
    position: "absolute",
    flexDirection: "row",
    top: -16,
    bottom: isIphoneX() ? 77 : 68,
    left: 0,
    right: 0,
  },
  iconContainer: {
    position: "absolute",
    top: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
