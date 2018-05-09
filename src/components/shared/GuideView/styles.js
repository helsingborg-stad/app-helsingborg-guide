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
    marginHorizontal: "4%",
    width: "100%",
  },
  title: {
    ...StyleSheet.flatten(TextStyles.title),
    marginHorizontal: "4%",
  },
});

export default styles;
