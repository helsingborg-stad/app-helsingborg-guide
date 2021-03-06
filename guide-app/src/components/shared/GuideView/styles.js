import { StyleSheet } from "react-native";
import { TextStyles, Colors } from "@assets/styles";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingBottom: 60,
  },
  viewContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  downloadButton: {
    width: "100%",
  },
  image: {
    aspectRatio: 18 / 9,
    width: "100%",
    height: "auto",
  },
  objectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  objectContainer: {
    width: "50%",
    height: "auto",
  },
  objectButtonContainer: {
    padding: "4%",
  },
  objectImage: {
    aspectRatio: 1,
    width: "100%",
    height: "auto",
  },
  textContainer: {
    marginHorizontal: "4%",
  },
  optionalTexts: {
    marginBottom: 14,
  },
  guideTaglineText: {
    ...StyleSheet.flatten(TextStyles.medium),
  },
  title: {
    ...StyleSheet.flatten(TextStyles.title),
    ...TextStyles.defaultFontFamily,
    marginVertical: "4%",
  },
  contentIdText: {
    ...StyleSheet.flatten(TextStyles.small),
    color: Colors.gray3,
    marginTop: 2,
  },
  contentTitleText: {
    ...StyleSheet.flatten(TextStyles.medium),
  },
  shareBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 50,
  },
  quizContainer: {
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 8,
  },
  buttonIcon: {
    alignSelf: "center",
  },
  quizText: {
    color: Colors.themeSecondary,
  },
});

export default styles;
