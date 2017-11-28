import React from "react";
import {
  FlatList,
  StyleSheet,
} from "react-native";
import ListCard from "./ListCard";

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

const GuideList = ({ items, onPress }) => (
  <FlatList
    style={styles.listContainer}
    data={items}
    renderItem={({ item }) => {
      let image;
      let title;
      if (item.type === "location") {
        image = item.apperance.image.sizes.medium;
        title = item.name;
      } else if (item.type === "guide") {
        image = item.guide_images[0].sizes.large;
        title = item.title.plain_text;
      }

      if (!image) return null;

      return (
        <ListCard
          title={title}
          image={image}
          onPress={() => onPress(item)}
        />
      );
    }}
    keyExtractor={item => item.id}
  />
);

export default GuideList;
