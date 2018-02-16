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
    AnalyticsUtils.logEvent("view_location", { name: location.slug });
    navigate("LocationDetailsScreen", { location });
  };

  const _navigateToTrail = (trail) => {
    const { navigate } = navigation;
    const title = trail.guidegroup[0].name;
    AnalyticsUtils.logEvent("view_guide", { name: trail.slug });
    navigate("TrailScreen", { trail, title });
  };

  const _navigateToGuide = (guide) => {
    const { navigate } = navigation;
    const title = guide.title.plain_text;
    AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
    navigate("GuideDetailsScreen", { id: guide.id, title });
  };

  const renderItem = ({ item }) => {
    const { distance, contentType } = item;

    let image;
    let title;
    let pressHandler;
    let openingHours;
    let icon;
    let guideID;

    if (contentType === "location") {
      image = item.apperance.image.sizes.thumbnail;
      title = item.name;
      pressHandler = _navigateToLocation;
      openingHours = getOpeningHours(item);
      icon = iconLocation;
    } else if (contentType === "trail") {
      image = item.guide_images[0].sizes.thumbnail;
      title = item.title.plain_text;
      pressHandler = _navigateToTrail;
      icon = iconGuide;
      guideID = item.id;
    } else if (contentType === "guide") {
      image = item.guide_images[0].sizes.thumbnail;
      title = item.title.plain_text;
      pressHandler = _navigateToGuide;
      icon = iconGuide;
      guideID = item.id;
    }

    if (!image) return null;

    return (
      <ListCard
        title={title}
        description={item.description}
        type={contentType}
        numberOfGuides={item.numberOfGuides}
        image={image}
        onPress={() => pressHandler(item)}
        openingHours={openingHours}
        distance={distance}
        icon={icon}
        forChildren={item.guide_kids}
        guideID={guideID}
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
