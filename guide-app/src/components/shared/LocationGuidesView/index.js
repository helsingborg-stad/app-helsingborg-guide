// @flow

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ListItem from "@shared-components/ListItem";
import styles from "./style";
import LangService from "@services/langService";

type Props = {
  guides: Guide[],
  onPressGuide(guide: Guide): void
};

const LocationGuidesView = (props: Props) => {
  const { guides, onPressGuide } = props;
  return (
    <View style={styles.guideListContainer}>
      <Text style={styles.guideListHeaderText}>
        {LangService.strings.MEDIAGUIDES}
      </Text>
      {guides.map(guide => {
        if (!guide.images) {
          return null;
        }
        const forKids = guide.childFriendly;

        return (
          <TouchableOpacity
            key={guide.id}
            style={styles.guideContainer}
            onPress={() => onPressGuide(guide)}
          >
            <ListItem /** TODO: CREATE NEW VERSION OF ListItem */
              imageSource={{ uri: guide.images.medium }}
              title={guide.name}
              description={guide.tagline}
              startDate={guide.dateStart}
              endDate={guide.dateEnd}
              forKids={forKids}
              // id={guide.id}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LocationGuidesView;
