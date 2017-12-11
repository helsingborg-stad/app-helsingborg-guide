import React from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";

const screenWidth = Dimensions.get("window").width;
const defaultMargin = 18;
const closeButtonSize = 26;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: screenWidth - (defaultMargin * 2),
    margin: defaultMargin,
    backgroundColor: Colors.white,
  },
  closeButton: {
    width: closeButtonSize,
    height: closeButtonSize,
    backgroundColor: Colors.purple,
    borderRadius: closeButtonSize / 2,
  },
  titleText: StyleSheetUtils.flatten([
    TextStyles.title, {
      fontSize: 30,
      lineHeight: 30,
      margin: defaultMargin,
    },
  ]),
  descriptionText: StyleSheetUtils.flatten([
    TextStyles.description, {
      margin: defaultMargin,
    },
  ]),
});


const MapInformationOverlay = ({ trailInformation }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.titleText}>{trailInformation.title} </Text>
    <Text style={styles.descriptionText}>{trailInformation.description}</Text>
  </ScrollView>
);

export default MapInformationOverlay;
