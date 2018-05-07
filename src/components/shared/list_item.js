import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LangService from "../../services/langService";
import { Colors, TextStyles } from "../../styles/";
import { StyleSheetUtils } from "../../utils/";

const styles = StyleSheet.create({
  titleContainer: { flex: 1, padding: 15 },
  title: StyleSheetUtils.flatten([
    TextStyles.title, {
      color: Colors.black,
    }],
  ),
  imageContainer:
    {
      width: "100%",
      height: "auto",
      aspectRatio: 16 / 9,
    },
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
    <Image
      style={styles.imageContainer}
      source={imageSource}
      resizeMode="cover"
    /* guideID={id} */ // TODO: offline support
    />
  );
}

function renderDate(startDate, endDate) {
  if (!startDate || !endDate) { return null; }

  const start = new Date(startDate);
  const end = new Date(endDate);

  return (<Text style={styles.date} numberOfLines={1}>
    {`${start.toISOString().substring(0, 10)} - ${end.toISOString().substring(0, 10)}`}
  </Text>);
}

export default function ListItem({ forKids, title, description, startDate, endDate, imageSource, id }) { // TODO: we will need id later for offline lookup
  return (
    <View>
      <View>{displayImage(imageSource)}</View>
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
