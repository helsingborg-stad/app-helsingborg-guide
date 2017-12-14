import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import TextStyles from "guide-hbg/src/styles/TextStyles";
import Colors from "guide-hbg/src/styles/Colors";
import StyleSheetUtils from "guide-hbg/src/utils/StyleSheetUtils";
import DistanceView from "./DistanceView";
import LangService from "../../services/langService";

const iconKids = require("../../images/kids.png");

const imageSize = 120;
const defaultMargin = 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  imageInfoContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  image: {
    height: imageSize,
    width: imageSize,
  },
  infoTextContainer: {
    flex: 1,
    marginHorizontal: defaultMargin,
    marginTop: defaultMargin,
    marginBottom: 0,
    flexDirection: "column",
  },
  title: StyleSheetUtils.flatten([
    TextStyles.title, {
      color: Colors.black,
      textAlign: "left",
      marginBottom: 7,
      marginRight: defaultMargin,
    }],
  ),
  forChildrenText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.darkGrey,
      marginLeft: 6,
      fontWeight: "500",
      textAlign: "left",
    }],
  ),
  forChildrenContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forChildrenIcon: {
    width: 17,
    height: 17,
  },
  descriptionText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: "#505050",
      textAlign: "left",
      fontWeight: "400",
      fontStyle: "italic",
      margin: defaultMargin,
      marginTop: 13,
      marginBottom: 20,
    }],
  ),
  openingHoursText: StyleSheetUtils.flatten([
    TextStyles.description, {
      fontWeight: "400",
      color: Colors.black,
      textAlign: "left",
    }],
  ),
  distanceText: StyleSheetUtils.flatten([
    TextStyles.description, {
      fontWeight: "400",
      color: Colors.warmGrey,
      textAlign: "left",
    }],
  ),
  numberOfGuidesText: StyleSheetUtils.flatten([
    TextStyles.description, {
      marginTop: 6,
      color: Colors.purple,
      fontWeight: "500",
      textAlign: "left",
    }],
  ),
});

function displayOpeningHours(openingHours) {
  if (!openingHours) return null;

  return (
    <Text style={styles.openingHoursText}>{openingHours}</Text>
  );
}

function displayDistance(distance) {
  if (!distance) return null;

  return (
    <DistanceView style={styles.distanceText} distance={distance} useFromHereText />
  );
}

function displayGuideNumber(numberOfGuides, type) {
  if (!numberOfGuides || !type) return null;
  let textString;
  const plural = numberOfGuides > 1;

  const locationString = plural ? LangService.strings.LOCATIONS : LangService.strings.LOCATION;
  const mediaGuideString = plural ? LangService.strings.MEDIAGUIDES : LangService.strings.MEDIAGUIDE;

  if (type === "location") {
    textString = `${numberOfGuides} ${mediaGuideString.toLowerCase()}`;
  } else if (type === "trail") {
    textString = `${LangService.strings.TOUR} ${LangService.strings.WITH} ${numberOfGuides} ${locationString}`;
  } else if (type === "guide") {
    textString = `${LangService.strings.MEDIAGUIDE} ${LangService.strings.WITH} ${numberOfGuides} ${LangService.strings.OBJECT}`;
  }

  return (
    <Text style={styles.numberOfGuidesText}>{textString}</Text>
  );
}

function displayForChildren() {
  return (
    <View style={styles.forChildrenContainer} >
      <Image source={iconKids} resizeMode="contain" style={styles.forChildrenIcon} />
      <Text style={styles.forChildrenText}>{LangService.strings.FOR_CHILDREN}</Text>
    </View>
  );
}

const ListCard = ({ title, description, type, numberOfGuides, image, onPress, openingHours, distance, icon, forChildren }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={styles.container}>
      <View style={styles.imageInfoContainer}>
        <ImageBackground
          style={styles.image}
          resizeMode="cover"
          source={{ uri: image }}
        />
        <View style={styles.infoTextContainer}>
          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {title}
          </Text>
          {displayOpeningHours(openingHours)}
          {displayDistance(distance)}
          {displayGuideNumber(numberOfGuides, type)}
          {forChildren ? displayForChildren() : null}
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text
          style={styles.descriptionText}
          numberOfLines={3}
        >
          {description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default ListCard;
