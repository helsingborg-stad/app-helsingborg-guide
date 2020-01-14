// @flow

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheetUtils } from "@utils";
import { TextStyles, Colors } from "@assets/styles";

import type { MaterialIconsGlyphs } from "react-native-vector-icons/MaterialIcons";

type Props = {
  onPress: Function,
  iconName: MaterialIconsGlyphs,
  text: string
};

const textMargin = 13;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  text: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      color: Colors.themePrimary
    }
  ])
});

export default function IconTextTouchable(props: Props) {
  const directions = (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Icon name={props.iconName} size={24} color={Colors.themePrimary} />
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );

  return directions;
}
