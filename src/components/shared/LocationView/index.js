// @flow

import React from "react";
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import styles from "./style";

import DistanceView from "../DistanceViewNew";
import IconTextTouchable from "../IconTextTouchable";
import LangService from "../../../services/langService";
import ListItem from "../../shared/list_item";
import OpeningHoursView from "../OpeningHoursView";
import SVGView from "../../shared/SVGView";

import { AnalyticsUtils, UrlUtils, LocationUtils } from "../../../utils/";
import WebLinkView from "../WebLinkView";

const pointPropertyPlaceholderImage = require("../../../images/iconPointPropertyPlaceholder.svg");

type Props = {
  guideGroup: GuideGroup,
  guides: Guide[],
  now: Date,
  geolocation?: ?GeolocationType,
  navigation: any
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

function openGoogleMapApp(geolocation: GeolocationType, lat: number, lng: number) {
  const directionsUrl = LocationUtils.directionsUrl(lat, lng, geolocation);
  UrlUtils.openUrlIfValid(directionsUrl, LangService.strings.OPEN_IN_MAPS, "", LangService.strings.CANCEL, LangService.strings.OPEN);
}

function displayDirections(geolocation: GeolocationType, location: Location) {
  return (
    <IconTextTouchable
      iconName="directions"
      text={LangService.strings.DIRECTIONS}
      onPress={() => {
        openGoogleMapApp(geolocation,
          location.latitude,
          location.longitude);
      }}
    />
  );
}

function displayPointProperties(pointProperties: PointProperty[]) {
  const pointPropertyView = (
    <View>
      <View style={styles.divider} />
      <View style={styles.pointPropertiesSectionContainer}>
        {pointProperties.map(element =>
          (<View style={styles.pointPropertyContainer} key={element.id} >
            <SVGView logoType={element.icon} placeholderImage={pointPropertyPlaceholderImage} customStyle={styles.pointPropertyIcon} />
            <Text style={styles.pointPropertyText} >{element.name}</Text>
          </View>),
        )}
      </View>
    </View>
  );
  return pointPropertyView;
}

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

function displayGuides(guides: Guide[], navigation: Object) {
  return (<View style={styles.guideListContainer}>
    <Text style={styles.guideListHeaderText}>
      {LangService.strings.MEDIAGUIDES}
    </Text>
    {guides.map((guide) => {
      if (!guide.images || !guide.images.length) return null;
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
                openHours={props.guideGroup.location.openingHours}
                openHoursException={props.guideGroup.location.openingHourExceptions}
                now={props.now}
                textStyle={styles.openTimeText}
              />
              {props.geolocation ? displayDistance(props.geolocation, props.guideGroup.location) : null}
            </View>
            {props.geolocation ? displayDirections(props.geolocation, props.guideGroup.location) : null}
          </View>
          {displayGuides(props.guides, props.navigation)}
          <View style={styles.articleContainer}>
            <Text style={styles.articleHeaderText}>{`${LangService.strings.ABOUT} ${props.guideGroup.name}`}</Text>
            <Text style={styles.articleDescriptionText}>{props.guideGroup.description}</Text>
          </View>
          {webUrl ? <WebLinkView url={webUrl} navigation={props.navigation} /> : null}
          {displayPointProperties(props.guideGroup.pointProperties)}
        </View>
      </ScrollView>
    </View>
  );
};

LocationView.defaultProps = {
  geolocation: null,
};

export default LocationView;
