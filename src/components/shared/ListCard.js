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
  },
  image: {
    flex: 1,
    height: 220,
  },
  infoContainer: {
    flex: 1,
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
      resizeMode="contain"
      source={{ uri: image }}
    />
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </View>
);

export default ListCard;
