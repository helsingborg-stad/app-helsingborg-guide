import React from "react";
import {
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

  if (type === "location") {
    textString = plural ? `${numberOfGuides} mediaguider` : `${numberOfGuides} mediaguide`;
  } else if (type === "trail") {
    textString = plural ? `Rundtur med ${numberOfGuides} platser` : `Rundtur med ${numberOfGuides} plats`;
  } else if (type === "guide") {
    textString = `Guide med ${numberOfGuides} objekt`;
  }

  return (
    <Text style={styles.numberOfGuidesText}>{textString}</Text>
  );
}

const ListCard = ({ title, description, type, numberOfGuides, image, onPress, openingHours, distance, icon }) => (
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
