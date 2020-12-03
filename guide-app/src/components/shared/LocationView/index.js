// @flow

import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "./style";

import DistanceView from "@shared-components/DistanceViewNew";
import IconTextTouchable from "@shared-components/IconTextTouchable";
import LangService from "@services/langService";
import OpeningHoursView from "@shared-components/OpeningHoursView";
import PointPropertiesView from "@shared-components/PointPropertiesView";
import LocationGuidesView from "@shared-components/LocationGuidesView";

import { UrlUtils, LocationUtils } from "@utils";
import WebLinkView from "@shared-components/WebLinkView";

type Props = {
  guideGroup: GuideGroup,
  guides: Guide[],
  interactiveGuide?: InteractiveGuide,
  now: Date,
  geolocation?: ?GeolocationType,
  isFetchingGuides?: boolean,
  navigation: any,
  onPressGuide(guide: Guide): void,
  onPressInteractiveGuide(interactiveGuide: InteractiveGuide): void,
};

function getWebUrl(links: LinkAndService[]): ?string {
  let webUrl = null;
  if (links) {
    links.forEach(element => {
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

function displayDistance(currentLocation: GeolocationType, location: Location) {
  return (
    <DistanceView
      textStyle={styles.distanceText}
      currentLocation={currentLocation}
      location={location}
      useFromHereText
    />
  );
}

function openGoogleMapApp(
  geolocation: GeolocationType,
  lat: number,
  lng: number
) {
  const directionsUrl = LocationUtils.directionsUrl(lat, lng, geolocation);
  UrlUtils.openUrlIfValid(
    directionsUrl,
    LangService.strings.OPEN_IN_MAPS,
    "",
    LangService.strings.CANCEL,
    LangService.strings.OPEN
  );
}

function displayDirections(geolocation: GeolocationType, location: Location) {
  return (
    <IconTextTouchable
      iconName="directions"
      text={LangService.strings.DIRECTIONS}
      onPress={() => {
        openGoogleMapApp(geolocation, location.latitude, location.longitude);
      }}
    />
  );
}

const LocationView = (props: Props) => {
  const { isFetchingGuides } = props;
  const webUrl = getWebUrl(props.guideGroup.location.links);

  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageViewContainer}>
          <ImageBackground
            source={{ uri: props.guideGroup.images.large }}
            style={styles.imageBackground}
          >
            {!props.guideGroup.active
              ? displayComingSoon(LangService.strings.COMING_SOON)
              : null}
          </ImageBackground>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{props.guideGroup.name}</Text>
            <View style={styles.openingHoursAndDistanceContainer}>
              <OpeningHoursView
                openHours={props.guideGroup.location.openingHours}
                openHoursException={
                  props.guideGroup.location.openingHourExceptions
                }
                now={props.now}
              />
              {props.geolocation
                ? displayDistance(props.geolocation, props.guideGroup.location)
                : null}
            </View>
            {props.geolocation
              ? displayDirections(props.geolocation, props.guideGroup.location)
              : null}
          </View>
          {isFetchingGuides ? (
            <ActivityIndicator />
          ) : (
            <LocationGuidesView
              guides={props.guides}
              interactiveGuide={props.interactiveGuide}
              onPressGuide={props.onPressGuide}
              onPressInteractiveGuide={props.onPressInteractiveGuide}
            />
          )}
          <View style={styles.articleContainer}>
            <Text style={styles.articleHeaderText}>{`${
              LangService.strings.ABOUT
            } ${props.guideGroup.name}`}</Text>
            <Text style={styles.articleDescriptionText}>
              {props.guideGroup.description}
            </Text>
          </View>
          {webUrl ? (
            <WebLinkView url={webUrl} navigation={props.navigation} />
          ) : null}
          <PointPropertiesView
            pointProperties={props.guideGroup.pointProperties}
          />
        </View>
      </ScrollView>
    </View>
  );
};

LocationView.defaultProps = {
  geolocation: null,
  onPressGuide: () => {},
  isFetchingGuides: false,
};

export default LocationView;
