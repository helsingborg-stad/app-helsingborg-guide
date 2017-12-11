import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";

const screenWidth = Dimensions.get("window").width;
const defaultMargin = 17;
const closeButtonSize = 26;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: screenWidth - (defaultMargin * 2),
    margin: defaultMargin,
    backgroundColor: Colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  scrollView: {
    maxHeight: 360,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
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
      marginTop: 22,
      marginHorizontal: defaultMargin,
    },
  ]),
  descriptionText: StyleSheetUtils.flatten([
    TextStyles.description, {
      margin: defaultMargin,
      color: Colors.greyBodyText,
      lineHeight: 22,
    },
  ]),
});


const MapInformationOverlay = ({ trailInformation, onPressFunction }) => (
  <View style={styles.container}>
    <Text style={styles.titleText}>{trailInformation.title} </Text>
    <TouchableOpacity onPress={onPressFunction} style={styles.closeButtonContainer}>
      <View style={styles.closeButton} key="closeButton" />
    </TouchableOpacity>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.descriptionText}>{trailInformation.description}</Text>
    </ScrollView>
  </View>
);

export default MapInformationOverlay;
