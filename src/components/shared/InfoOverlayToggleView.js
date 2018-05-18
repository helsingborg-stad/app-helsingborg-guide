// @flow

import React from "react";
import { Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StyleSheetUtils } from "../../utils/";
import { TextStyles, Colors } from "../../styles/";

import LangService from "../../services/langService";

const infoBarButtonIcon = require("../../images/iconInfo.png");

const styles = StyleSheet.create({
  barButtonItem: {
    opacity: 0.7,
    flexDirection: "row",
    right: 5,
    width: 120,
    height: 44,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barButtonItemImage: {
    margin: 5,
  },
  barButtonItemText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.white,
    },
  ]),
});

declare type Props =
  {
    onToggleInfoOverlay: () => (void),
  }

export default function InfoOverlayToggleView(props: Props) {
  const button = (
    <TouchableOpacity
      onPress={props.onToggleInfoOverlay}
      style={styles.barButtonItem}
    >
      <Text style={styles.barButtonItemText}>{LangService.strings.INFO}</Text>
      <Image style={styles.barButtonItemImage} source={infoBarButtonIcon} />
    </TouchableOpacity>
  );

  return button;
}
