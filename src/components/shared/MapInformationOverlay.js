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
const defaultMargin = 18;
const closeButtonSize = 26;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: screenWidth - (defaultMargin * 2),
    margin: defaultMargin,
    backgroundColor: Colors.white,
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
      margin: defaultMargin,
    },
  ]),
  descriptionText: StyleSheetUtils.flatten([
    TextStyles.description, {
      margin: defaultMargin,
      color: Colors.greyBodyText,
    },
  ]),
});


const MapInformationOverlay = ({ trailInformation, onPressFunction }) => (
  <View style={styles.container}>
    <Text style={styles.titleText}>{trailInformation.title} </Text>
    <TouchableOpacity onPress={onPressFunction} style={styles.closeButtonContainer}>
      <View style={styles.closeButton} key="closeButton" />
    </TouchableOpacity>
    <ScrollView>
      <Text style={styles.descriptionText}>{trailInformation.description}</Text>
    </ScrollView>
  </View>
);

export default MapInformationOverlay;
