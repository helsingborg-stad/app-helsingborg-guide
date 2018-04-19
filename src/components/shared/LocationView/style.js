import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../../styles/Colors";


const displayWidth = Dimensions.get("window").width;
const displayHeight = (displayWidth / 16) * 9;
const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.65;

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  scrollView: {},
  imageViewContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageBackground: {
    width: displayWidth,
    height: displayHeight,
    maxHeight: MAX_IMAGE_HEIGHT,
    zIndex: 1000,
  },
});
