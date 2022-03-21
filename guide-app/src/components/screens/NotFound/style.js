import { StyleSheet, Dimensions } from "react-native";

const style = StyleSheet.create({

  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    overflow: "hidden",
  },

})

export default style;
