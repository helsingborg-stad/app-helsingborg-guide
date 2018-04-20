import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheetUtils } from "../../utils/";
import { TextStyles, Colors } from "../../styles/";

const textMargin = 13;

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemLinkText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 16,
      fontWeight: "500",
      marginRight: textMargin,
      marginLeft: 7,
      color: Colors.purple,
    },
  ]),
});

export default function LinkTouchable(props) {
  const link = (
    <TouchableOpacity
      style={styles.linkContainer}
      onPress={props.onPress}
    >
      <Icon name="language" size={24} color={Colors.purple} />
      <Text style={styles.listItemLinkText}>{props.title}</Text>
    </TouchableOpacity>
  );

  return link;
}
