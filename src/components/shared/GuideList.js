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
      const image = item.apperance.image.sizes.medium;
      return (
        <ListCard
          title={item.name}
          image={image}
          onPress={() => onPress(item)}
        />
      );
    }}
    keyExtractor={item => item.id}
  />
);

export default GuideList;
