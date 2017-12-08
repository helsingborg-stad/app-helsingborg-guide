import React from "react";
import {
  FlatList,
  StyleSheet,
} from "react-native";
import { AnalyticsUtils } from "../../utils";
import ListCard from "./ListCard";
import TimingService from "../../services/timingService";

const iconGuide = require("./../../images/iconRundtur.png");
const iconLocation = require("./../../images/iconPlats.png");

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

export default ({ items, navigation, locations, subLocations }) => {
  function getOpeningHours(location) {
    const openingList = location._embedded.location[0].open_hours;
    const expList = location._embedded.location[0].open_hour_exceptions;
    const opening = TimingService.getOpeningHours(openingList, expList);
    const text = opening || "";
    return text;
  }

  function numberOfGuidesForItem(item) {
    const { contentType, id } = item;
    let numberOfGuides = 0;

    if (contentType === "location") {
      numberOfGuides = subLocations.filter(subLocationItem => subLocationItem.guidegroup[0].id === id).length;
    } else {
      numberOfGuides = Object.keys(item.contentObjects).length;
    }
    return numberOfGuides;
  }

  function descriptionForItem(item) {
    const { description, contentType } = item;
    if (contentType === "trail") {
      return locations.find(location => location.id === item.guidegroup[0].id).description;
    } else if (contentType === "guide") {
      return item.content.plain_text;
    }
    return description;
  }

  const _navigateToLocation = (location) => {
    const { navigate } = navigation;
    AnalyticsUtils.logEvent("view_location", { id: location.id, name: location.slug });
    navigate("LocationDetailsScreen", { location });
  };

  const _navigateToTrail = (trail) => {
    const { navigate } = navigation;
    const title = trail.guidegroup[0].name;
    AnalyticsUtils.logEvent("view_guide", { id: trail.id, name: trail.slug });
    navigate("TrailScreen", { trail, title });
  };

  const _navigateToGuide = (guide) => {
    const { navigate } = navigation;
    const title = guide.guidegroup[0].name;
    AnalyticsUtils.logEvent("view_guide", { id: guide.id, name: guide.slug });
    navigate("GuideDetailsScreen", { id: guide.id, title });
  };

  const renderItem = ({ item }) => {
    const { distance, contentType } = item;

    let image;
    let title;
    let pressHandler;
    let openingHours;
    let icon;

    if (contentType === "location") {
      image = item.apperance.image.sizes.medium;
      title = item.name;
      pressHandler = _navigateToLocation;
      openingHours = getOpeningHours(item);
      icon = iconLocation;
    } else if (contentType === "trail") {
      image = item.guide_images[0].sizes.large;
      title = item.title.plain_text;
      pressHandler = _navigateToTrail;
      icon = iconGuide;
    } else if (contentType === "guide") {
      image = item.guide_images[0].sizes.large;
      title = item.title.plain_text;
      pressHandler = _navigateToGuide;
      icon = iconGuide;
    }

    if (!image) return null;

    return (
      <ListCard
        title={title}
        description={descriptionForItem(item)}
        type={contentType}
        numberOfGuides={numberOfGuidesForItem(item)}
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
