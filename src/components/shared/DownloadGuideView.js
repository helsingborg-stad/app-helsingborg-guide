import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheetUtils } from "../../utils/";
import { TextStyles, Colors } from "../../styles/";
import LangService from "../../services/langService";

const textMargin = 13;

const styles = StyleSheet.create({
  downloadGuideContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.warmGrey,
  },
  downloadGuideText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      color: Colors.purple,
    },
  ]),
});

export default function DownloadGuideView(props) {
  const view = (
    <TouchableOpacity
      style={styles.downloadGuideContainer}
      onPress={props.onPress}
    >
      <Icon name="get-app" size={24} color={Colors.purple} />
      <Text style={styles.downloadGuideText}>{LangService.strings.DOWNLOAD}</Text>
    </TouchableOpacity>
  );

  return view;
}
