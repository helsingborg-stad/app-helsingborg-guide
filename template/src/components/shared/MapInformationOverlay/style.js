import { Dimensions, StyleSheet } from "react-native";
import { StyleSheetUtils } from "@utils";
import { Colors, TextStyles } from "@assets/styles";

const defaultMargin = 17;
const closeButtonSize = 26;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const scrollViewMaxHeight = screenHeight - 138; // magic number here, but roughly (listitem + header + margins)

export default StyleSheet.create({
  container: {
    position: "absolute",
    width: screenWidth - defaultMargin * 2,
    margin: defaultMargin,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 5,
    shadowOpacity: 1
  },
  scrollView: {
    maxHeight: scrollViewMaxHeight
  },
  scrollViewNoTitle: {
    maxHeight: scrollViewMaxHeight,
    width: "90%"
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10
  },
  closeButton: {
    width: closeButtonSize,
    height: closeButtonSize,
    backgroundColor: Colors.white,
    borderRadius: closeButtonSize / 2
  },
  titleText: StyleSheetUtils.flatten([
    TextStyles.title,
    {
      color: Colors.black,
      fontSize: 24,
      lineHeight: 36,
      marginTop: 22,
      marginHorizontal: defaultMargin
    }
  ]),
  descriptionText: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      margin: defaultMargin,
      color: Colors.greyBodyText,
      lineHeight: 22
    }
  ]),
  shareContainer: {
    paddingLeft: defaultMargin,
    paddingRight: defaultMargin,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});
