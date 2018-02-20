import React from "react";
import {
  Dimensions,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import TextStyles from "guide-hbg/src/styles/TextStyles";
import Colors from "guide-hbg/src/styles/Colors";
import StyleSheetUtils from "guide-hbg/src/utils/StyleSheetUtils";
import DistanceView from "./DistanceView";
import LangService from "../../services/langService";
import OImage from "./image";

const iconKids = require("../../images/kids.png");

const imageSize = 120;
const defaultMargin = 15;
const screenWidth = Dimensions.get("window").width;
const smallScreenWidth = 350;

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
      fontSize: screenWidth < smallScreenWidth ? 18 : 22,
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
    margin: screenWidth < smallScreenWidth ? defaultMargin : 0,
    marginTop: 0,
    marginBottom: 0,
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
      margin: screenWidth < smallScreenWidth ? defaultMargin : 0,
      marginTop: screenWidth < smallScreenWidth ? 13 : 6,
      marginBottom: 0,
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

function displayTitle(title) {
  return (
    <View>
      <Text
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </Text>
    </View>
  );
}

function displayForChildren(smallScreen) {
  return (
    <View style={smallScreen ? styles.forChildrenContainerSmallScreen : styles.forChildrenContainer} >
      <Image source={iconKids} resizeMode="contain" style={styles.forChildrenIcon} />
      <Text style={styles.forChildrenText}>{LangService.strings.FOR_CHILDREN}</Text>
    </View>
  );
}

const ListCard = ({ title, description, type, numberOfGuides, image, onPress, openingHours, distance,
  forChildren, guideID, smallScreen }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.imageInfoContainer}>
          <OImage
            style={styles.image}
            resizeMode="cover"
            source={{ uri: image }}
            guideID={guideID}
          />

          <View style={styles.infoTextContainer}>
            {displayTitle(title)}
            {displayOpeningHours(openingHours)}
            {displayDistance(distance)}
            {smallScreen ? null : displayGuideNumber(numberOfGuides, type)}
            {forChildren && !smallScreen ? displayForChildren() : null}
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          {smallScreen ? displayGuideNumber(numberOfGuides, type) : null}
          {forChildren && smallScreen ? displayForChildren() : null}
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
