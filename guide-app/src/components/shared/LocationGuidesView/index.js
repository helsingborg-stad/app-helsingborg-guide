// @flow

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ListItem from "@shared-components/ListItem";
import styles from "./style";
import LangService from "@services/langService";


const placeholderImage = require("@assets/images/no-image-featured-image.png");


type Props = {
  guides: Guide[],
  interactiveGuide?: InteractiveGuide,
  onPressGuide(guide: Guide): void,
  onPressInteractiveGuide?: (interactiveGuide: InteractiveGuide) => void,
};



const LocationGuidesView = (props: Props) => {
  const {
    guides,
    interactiveGuide,
    onPressGuide,
    onPressInteractiveGuide,
  } = props;

  return (
    <View style={styles.guideListContainer}>
      <Text style={styles.guideListHeaderText}>
        {LangService.strings.MEDIAGUIDES}
      </Text>
      {interactiveGuide && (
        <TouchableOpacity
          style={styles.guideContainer}
          onPress={() => onPressInteractiveGuide(interactiveGuide)}
        >
          <ListItem
            imageSource={{ uri: interactiveGuide.image }}
            title={interactiveGuide.title}
          />
        </TouchableOpacity>
      )}
      {guides.map(guide => {

        const forKids = guide.childFriendly;
        return (
          <TouchableOpacity
            key={guide.id}
            style={styles.guideContainer}
            onPress={() => onPressGuide(guide)}
          >
            <ListItem /** TODO: CREATE NEW VERSION OF ListItem */
              imageSource={{ uri: guide?.images?.medium || null }}
              title={guide.name}
              description={guide.tagline}
              startDate={guide.dateStart}
              endDate={guide.dateEnd}
              forKids={forKids}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LocationGuidesView;
