// @flow

import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import styles from "./style";
import DistanceView from "../DistanceViewNew";
import IconTextTouchable from "../IconTextTouchable";
import OpeningHoursView from "../OpeningHoursView";
import WebLinkView from "../WebLinkView";
import LangService from "../../../services/langService";
import { UrlUtils, LocationUtils } from "../../../utils/";

type Props = {
  guideGroup: GuideGroup,
  now: Date,
  geolocation: GeolocationType,
  navigation: Object
}

function getWebUrl(links: Link[]): ?string {
  let webUrl = null;
  if (links) {
    links.forEach((element) => {
      if (element.service === "webpage") {
        webUrl = element.url;
      }
    });
  }
  return webUrl;
}

function displayComingSoon(comingSoonText: string) {
  return (
    <View style={styles.comingSoonView}>
      <Text style={styles.comingSoonText}>{comingSoonText}</Text>
    </View>
  );
}

function openGoogleMapApp(geolocation: GeolocationType, lat: number, lng: number) {
  const directionsUrl = LocationUtils.directionsUrl(lat, lng, geolocation);
  UrlUtils.openUrlIfValid(directionsUrl, LangService.strings.OPEN_IN_MAPS, "", LangService.strings.CANCEL, LangService.strings.OPEN);
}

const LocationView = (props: Props) => {
  const webUrl = getWebUrl(props.guideGroup.location.links);
  return (
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
            <IconTextTouchable
              iconName="directions"
              text={LangService.strings.DIRECTIONS}
              onPress={() => {
                openGoogleMapApp(props.geolocation,
                  props.guideGroup.location.latitude,
                  props.guideGroup.location.longitude);
              }}
            />
          </View>
          {/* TODO: list of guides! with the new guide data */}
          <View style={styles.articleContainer}>
            <Text style={styles.articleHeaderText}>{`${LangService.strings.ABOUT} ${props.guideGroup.name}`}</Text>
            <Text style={styles.articleDescriptionText}>{props.guideGroup.description}</Text>
          </View>
          {webUrl ? <WebLinkView url={webUrl} navigation={props.navigation} /> : null}
          {/* this.displayAccessibility() with the new pointproperties data */}
        </View>
      </ScrollView>
    </View>
  );
};

export default LocationView;
