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

const GuideList = ({ items, navigation }) => {
  const _navigateToLocation = (location) => {
    const { navigate } = navigation;
    navigate("LocationDetailsScreen", { location });
  };

  const _navigateToGuide = (guide) => {
    const { navigate } = navigation;
    const title = guide.guidegroup[0].name;
    navigate("GuideDetailsScreen", { id: guide.id, title });
  };

  return (
    <FlatList
      style={styles.listContainer}
      data={items}
      renderItem={({ item }) => {
        let image;
        let title;
        let pressHandler;
        if (item.type === "location") {
          image = item.apperance.image.sizes.medium;
          title = item.name;
          pressHandler = _navigateToLocation;
        } else if (item.type === "guide") {
          image = item.guide_images[0].sizes.large;
          title = item.title.plain_text;
          pressHandler = _navigateToGuide;
        }

        if (!image) return null;

        return (
          <ListCard
            title={title}
            image={image}
            onPress={() => pressHandler(item)}
          />
        );
      }}
      keyExtractor={item => item.id}
    />
  );
};

export default GuideList;
