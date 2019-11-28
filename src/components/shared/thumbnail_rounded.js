import React from "react";
import { View, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  thumbnailContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white"
  },
  iconContainer: { flex: 1, justifyContent: "center" }
});

type Props = {
  imageSource: string
};

export default (props: Props) => (
  <View style={styles.thumbnailContainer}>
    <Image source={props.imageSource} style={styles.image} />
  </View>
);
