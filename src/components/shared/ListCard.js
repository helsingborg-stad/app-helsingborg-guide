import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";

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
  title: {
    flex: 1,
  },
});

const ListCard = ({ title, image }) => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      resizeMode="contain"
      source={{ uri: image }}
    />
    <View style={styles.infoContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  </View>
);

export default ListCard;
