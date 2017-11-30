import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  ImageBackground,
  Image,
} from "react-native";
import TextStyles from "guide-hbg/src/styles/TextStyles";
import Colors from "guide-hbg/src/styles/Colors";
import StyleSheetUtils from "guide-hbg/src/utils/StyleSheetUtils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  image: {
    flex: 1,
    height: 210,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  title: StyleSheetUtils.flatten([
    TextStyles.title, {
      color: Colors.black,
    }],
  ),
  openingHours: {
    marginTop: 10,
  },
  distance: {
    marginTop: 4,
  },
  icon: {
    position: "absolute",
    top: 11,
    right: 10,
  },
});

function displayOpeningHours(openingHours) {
  if (!openingHours) return null;

  return (
    <Text style={styles.openingHours}>{openingHours}</Text>
  );
}

function displayDistance(distance) {
  if (!distance) return null;

  return (
    <Text style={styles.distance}>{distance} m</Text>
  );
}

const ListCard = ({ title, image, onPress, openingHours, distance, icon }) => (
  <TouchableHighlight onPress={onPress}>
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        resizeMode="cover"
        source={{ uri: image }}
      >
        <Image source={icon} style={styles.icon} />
      </ImageBackground >
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        {displayOpeningHours(openingHours)}
        {displayDistance(distance)}
      </View>
    </View>
  </TouchableHighlight>
);

export default ListCard;
