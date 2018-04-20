// @flow

import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import styles from "./style";
import DistanceView from "../DistanceViewNew";
import OpeningHoursView from "../OpeningHoursView";
import LangService from "../../../services/langService";

type Props = {
  guideGroup: GuideGroup,
  now: Date,
  geolocation: GeolocationType
}

function displayComingSoon(comingSoonText: string) {
  return (
    <View style={styles.comingSoonView}>
      <Text style={styles.comingSoonText}>{comingSoonText}</Text>
    </View>
  );
}

const LocationView = (props: Props) => (
  <View style={styles.viewContainer} >
    <ScrollView style={styles.scrollView}>
      <View style={styles.imageViewContainer}>
        <ImageBackground
          source={{ uri: props.guideGroup.images.large }}
          style={styles.imageBackground}
        >
          {!props.guideGroup.active ? displayComingSoon(LangService.strings.COMING_SOON) : null}
        </ImageBackground>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{props.guideGroup.name}</Text>
          <View style={styles.openTimeContainer}>
            <OpeningHoursView
              openHours={props.guideGroup.location.openHours}
              openHoursException={props.guideGroup.location.openHoursException}
              now={props.now}
              textStyle={styles.openTimeText}
            />
            <DistanceView
              textStyle={styles.distanceText}
              currentLocation={props.geolocation}
              location={props.guideGroup.location}
              useFromHereText
            />
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
);

export default LocationView;
