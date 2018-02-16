/**
 * Created by msaeed on 2017-02-04.
 */
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import OImage from "./image";
import LangService from "../../services/langService";
import { Colors, TextStyles } from "../../styles/";
import { StyleSheetUtils } from "../../utils/";

// The style bodyContainer of LocationDetailScreen has a padding of 20 on each side, hence the "- 40" part.
const MAX_IMAGE_WIDTH = Dimensions.get("window").width - 40;

const styles = StyleSheet.create({
  thumbnail: {
    width: MAX_IMAGE_WIDTH,
    height: (MAX_IMAGE_WIDTH / 16) * 9,
  },
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

function displayImage(imageSource, id) {
  return (
    <OImage style={styles.thumbnail} source={imageSource} resizeMode="cover" guideID={id} />
  );
}

function renderDate(startDate, endDate) {
  if (startDate === null || endDate === null) { return null; }

  return <Text style={styles.date} numberOfLines={1}>{`${startDate} - ${endDate}`}</Text>;
}

export default function ListItem({ forKids, title, description, startDate, endDate, imageSource, id }) {
  return (
    <View>
      <View>{displayImage(imageSource, id)}</View>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={1}>{description}</Text>
          {renderDate(startDate, endDate)}
          {forKids ? forKidsView() : null}
        </View>
      </View>
    </View>
  );
}
