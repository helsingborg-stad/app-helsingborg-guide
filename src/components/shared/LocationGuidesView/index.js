// @flow

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ListItem from "../../shared/list_item";
import styles from "./style";
import LangService from "../../../services/langService";
import { AnalyticsUtils } from "../../../utils/";

function goToGuide(guide: Guide, navigation: Object) {
  const { navigate } = navigation;
  AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
  if (guide.guideType === "trail") {
    navigate("TrailScreen", {
      title: guide.name,
      trail: guide,
    });
  } else if (guide.guideType === "guide") {
    navigate("GuideDetailsScreen", {
      title: guide.name,
      id: guide.id,
    });
  }
}

function getGuidesList(guides: Guide[], navigation: Object) {
  return (<View style={styles.guideListContainer}>
    <Text style={styles.guideListHeaderText}>
      {LangService.strings.MEDIAGUIDES}
    </Text>
    {guides.map((guide) => {
      if (!guide.images) return null;
      const forKids = guide.childFriendly;

      return (
        <TouchableOpacity
          key={guide.id}
          style={styles.guideContainer}
          onPress={() => goToGuide(guide, navigation)}
        >
          <ListItem /** TODO: CREATE NEW VERSION OF ListItem */
            imageSource={{ uri: guide.images.medium }}
            title={guide.name}
            description={guide.tagline}
            startDate={guide.dateStart}
            endDate={guide.dateEnd}
            forKids={forKids}
            id={guide.id}
          />
        </TouchableOpacity>
      );
    })}
  </View>
  );
}

type Props = {
  guides: Guide[],
  navigation: Object,
}

export default function LocationGuidesView(props: Props) {
  return getGuidesList(props.guides, props.navigation);
}
