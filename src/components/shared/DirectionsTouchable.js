import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheetUtils } from "../../utils/";
import { TextStyles, Colors } from "../../styles/";
import LangService from "../../services/langService";

const textMargin = 13;

const styles = StyleSheet.create({
  directionsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  listItemDirectionsText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      color: Colors.purple,
    },
  ]),
});

export default function DirectionsTouchable(props) {
  const directions = (
    <TouchableOpacity
      style={styles.directionsContainer}
      onPress={props.onPress}
    >
      <Icon name="directions" size={24} color={Colors.purple} />
      <Text style={styles.listItemDirectionsText}>{LangService.strings.DIRECTIONS}</Text>
    </TouchableOpacity>
  );

  return directions;
}
