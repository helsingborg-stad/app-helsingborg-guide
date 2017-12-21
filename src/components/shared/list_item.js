/**
 * Created by msaeed on 2017-02-04.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import OImage from "./image";
import LangService from "../../services/langService";
import { Colors, TextStyles } from "../../styles/";
import { StyleSheetUtils } from "../../utils/";

const styles = StyleSheet.create({
  listItem: {
    // height: 200,
    // backgroundColor:'white',
  },
  thumbnailContainer: {
    flex: 1,
    // backgroundColor:'white'
  },
  thumbnail: { height: 180 },
  titleContainer: { flex: 1, padding: 15 },
  title: StyleSheetUtils.flatten([
    TextStyles.title, {
      color: Colors.black,
    }],
  ),
  description: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.black,
    }],
  ),
  date: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.warmGrey,
    }],
  ),
  forKidsText: StyleSheetUtils.flatten([
    TextStyles.description, {
      paddingHorizontal: 5,
      color: Colors.darkGrey,
    }],
  ),

  checkedContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

function forKidsView() {
  return (
    <View style={styles.checkedContainer}>
      <Icon name="face" size={20} color={Colors.darkGrey} />
      <Text style={styles.forKidsText}>{LangService.strings.FOR_CHILDREN}</Text>
    </View>
  );
}

function displayImage(imageSource) {
  return (
    <OImage style={styles.thumbnail} source={imageSource} resizeMode="cover" />
  );
}

export default function ListItem({ forKids, title, description, startDate, endDate, imageSource }) {
  return (
    <View>
      <View style={styles.thumbnailContainer}>{displayImage(imageSource)}</View>
      <View style={styles.listItem}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={1}>{description}</Text>
          <Text style={styles.date} numberOfLines={1}>{`${startDate} - ${endDate}`}</Text>
          {forKids ? forKidsView() : null}
        </View>
      </View>
    </View>
  );
}
