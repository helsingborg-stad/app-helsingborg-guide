import { StyleSheet } from "react-native";
import { TextStyles, Colors } from "../../../styles";


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
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
    padding: "4%",
  },
  objectImage: {
    aspectRatio: 1,
    width: "100%",
    height: "auto",
  },
  descriptionContainer: {
    paddingHorizontal: "4%",
    width: "100%",
  },
  guideTaglineText: {
    ...StyleSheet.flatten(TextStyles.medium),
    marginHorizontal: "4%",
  },
  title: {
    ...StyleSheet.flatten(TextStyles.title),
    marginHorizontal: "4%",
    marginVertical: "4%",
  },
  contentIdText: {
    ...StyleSheet.flatten(TextStyles.small),
    color: Colors.warmGrey,
    marginTop: 2,
  },
  contentTitleText: {
    ...StyleSheet.flatten(TextStyles.medium),
  },
});

export default styles;
