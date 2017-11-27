import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import TextStyles from "guide-hbg/src/styles/TextStyles";
import Colors from "guide-hbg/src/styles/Colors";
import StyleSheetUtils from "guide-hbg/src/utils/StyleSheetUtils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  image: {
    flex: 1,
    height: 210,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  title: StyleSheetUtils.flatten([
    TextStyles.title, {
      color: Colors.black,
    }],
  ),
});

const ListCard = ({ title, image }) => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      resizeMode="cover"
      source={{ uri: image }}
    />
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </View>
);

export default ListCard;
