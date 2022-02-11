import React from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { AnalyticsUtils } from "@utils";
import ListCard from "./ListCard";
import TimingService from "@services/timingService";
import { trackScreen } from "@utils/MatomoUtils";

const styles = StyleSheet.create({
  listContainer: {
    flex: 1
  }
});

const screenWidth = Dimensions.get("window").width;

type GuideViewProps = {
  items: any,
  navigation: any,
  dispatchSelectGuideGroup: any,
  dispatchSelectCurrentGuide: any,
  item: any
};

type RenderItemProps = {
  item: any
};

export default ({
  items,
  navigation,
  dispatchSelectGuideGroup,
  dispatchSelectCurrentGuide
}: GuideViewProps) => {
  function getOpeningHours(location) {
    const openingList = location._embedded.location[0].open_hours;
    const expList = location._embedded.location[0].open_hour_exceptions;
    const opening = TimingService.getOpeningHours(openingList, expList);
    const text = opening || "";
    return text;
  }

  const _navigateToLocation = location => {
    // TODO fetch from the the new GuideGroup state
    dispatchSelectGuideGroup(location);
    const { navigate } = navigation;
    trackScreen("view_location", location?.slug || "");
    // AnalyticsUtils.logEvent("view_location", { name: location.slug });
    navigate("LocationScreen", { location });
  };

  const _navigateToTrail = trail => {
    const { navigate } = navigation;
    const title = trail?.guidegroup[0]?.name;
    trackScreen("view_guide", trail?.slug || title || "");
    // AnalyticsUtils.logEvent("view_guide", { name: trail.slug });
    dispatchSelectCurrentGuide(trail);
    navigate("TrailScreen", { trail, title });
  };

  const _navigateToGuide = guide => {
    const { navigate } = navigation;
    const title = guide?.title?.plain_text;
    trackScreen("view_guide", guide?.slug || title || "");
    // AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
    dispatchSelectCurrentGuide(guide);
    navigate("GuideDetailsScreen", { id: guide.id, title });
  };

  const renderItem = ({ item }: RenderItemProps) => {
    const { distance, contentType } = item;

    let image;
    let title;
    let pressHandler;
    let openingHours;
    let guideID;

    if (contentType === "location") {
      image = item.apperance.image.sizes.thumbnail;
      title = item.name;
      pressHandler = _navigateToLocation;
      openingHours = getOpeningHours(item);
    } else if (contentType === "trail") {
      image = item.guide_images[0].sizes.thumbnail;
      title = item.title.plain_text;
      pressHandler = _navigateToTrail;
      guideID = item.id;
    } else if (contentType === "guide") {
      image = item.guide_images[0].sizes.thumbnail;
      title = item.title.plain_text;
      pressHandler = _navigateToGuide;
      guideID = item.id;
    }

    if (!image) {
      return null;
    }

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
        forChildren={item.guide_kids}
        guideID={guideID}
        smallScreen={screenWidth < 350}
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
