import { StyleSheet } from "react-native";
import { TextStyles, Colors } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white
  },
  viewContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: Colors.white
  },
  downloadButton: {
    width: "100%"
  },
  image: {
    aspectRatio: 18 / 9,
    width: "100%",
    height: "auto"
  },
  objectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  objectContainer: {
    width: "50%",
    height: "auto",
    padding: "4%"
  },
  objectImage: {
    aspectRatio: 1,
    width: "100%",
    height: "auto"
  },
  textContainer: {
    marginHorizontal: "4%"
  },
  optionalTexts: {
    marginBottom: "4%"
  },
  guideTaglineText: {
    ...StyleSheet.flatten(TextStyles.medium)
  },
  title: {
    ...StyleSheet.flatten(TextStyles.title),
    marginVertical: "4%"
  },
  contentIdText: {
    ...StyleSheet.flatten(TextStyles.small),
    color: Colors.warmGrey,
    marginTop: 2
  },
  contentTitleText: {
    ...StyleSheet.flatten(TextStyles.medium)
  },
  shareBtn: {
    position: "absolute",
    bottom: 25,
    right: 25,
    zIndex: 50
  }
});

export default styles;
