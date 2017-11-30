import React from "react";
import {
  FlatList,
  StyleSheet,
} from "react-native";
import ListCard from "./ListCard";
import TimingService from "../../services/timingService";

const iconGuide = require("./../../images/iconRundtur.png");
const iconLocation = require("./../../images/iconPlats.png");

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

export default ({ items, navigation }) => {
  function getOpeningHours(location) {
    const openingList = location._embedded.location[0].open_hours;
    const expList = location._embedded.location[0].open_hour_exceptions;
    const opening = TimingService.getOpeningHours(openingList, expList);
    const text = opening || "";
    return text;
  }

  const _navigateToLocation = (location) => {
    const { navigate } = navigation;
    navigate("LocationDetailsScreen", { location });
  };

  const _navigateToGuide = (guide) => {
    const { navigate } = navigation;
    const title = guide.guidegroup[0].name;
    navigate("TrailScreen", { guide, title });
  };

  const renderItem = ({ item }) => {
    let image;
    let title;
    let pressHandler;
    let openingHours;
    const { distance } = item;
    let icon;
    if (item.type === "location") {
      image = item.apperance.image.sizes.medium;
      title = item.name;
      pressHandler = _navigateToLocation;
      openingHours = getOpeningHours(item);
      icon = iconLocation;
    } else if (item.type === "guide") {
      image = item.guide_images[0].sizes.large;
      title = item.title.plain_text;
      pressHandler = _navigateToGuide;
      icon = iconGuide;
    }

    if (!image) return null;

    return (
      <ListCard
        title={title}
        image={image}
        onPress={() => pressHandler(item)}
        openingHours={openingHours}
        distance={distance}
        icon={icon}
      />
    );
  };

  return (
    <FlatList
      style={styles.listContainer}
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};
