// @flow
import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { XmlEntities } from "html-entities";

import { Colors, TextStyles } from "@assets/styles";
import { eventCalendarURL } from "@data/urls";
import LangService from "@services/langService";
import { StyleSheetUtils } from "@utils";
import { DateUtils } from "@utils";

const defaultImage = require("@assets/images/no-image-featured-image.png");

const styles = StyleSheet.create({
  item: {
    marginBottom: 30,
    padding: 4,
    width: "50%"
  },
  listItemImage: {
    height: 205,
    aspectRatio: 205 / 175
  },
  imageWrapper: {
    overflow: "hidden",
    alignItems: "stretch"
  },
  listItemTextContainer: {
    alignItems: "center"
  },
  listItemHoursContainer: {
    alignItems: "center",
    marginTop: -10,
    marginBottom: 4
  },
  listItemHoursView: {
    borderRadius: 4,
    backgroundColor: Colors.white,
    paddingTop: 5,
    paddingBottom: 4,
    paddingHorizontal: 15,
    shadowRadius: 12,
    shadowColor: "black",
    shadowOpacity: 0.16,
    elevation: 0
  },
  listItemHoursText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 13,
      lineHeight: 13,
      fontWeight: "500",
      fontStyle: "normal",
      color: Colors.black
    }
  ]),
  listLocationText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "500",
      letterSpacing: 0.75,
      textTransform: "uppercase",
      color: Colors.gray3,
      padding: 5,
      textAlign: "center"
    }
  ]),
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "900",
      fontStyle: "normal",
      color: Colors.black26,
      paddingBottom: 8,
      textAlign: "center",
      width: "80%"
    }
  ]),
  listItemDescription: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 13,
      lineHeight: 15,
      letterSpacing: 0.1,
      fontWeight: "normal",
      fontStyle: "normal",
      color: Colors.gray2C,
      textAlign: "center",
      paddingHorizontal: 4
    }
  ])
});

type Props = {
  event: Event,
  currentLanguage: string
};

function CalendarEvent({ event, currentLanguage }: Props) {
  const {
    description,
    imageUrl,
    location,
    name,
    slug,
    dateStart,
    dateEnd
  } = event;
  const image = imageUrl ? { uri: imageUrl } : defaultImage;

  const entities = new XmlEntities();
  const decodedLocationTitle = entities.decode(location.title);
  let hoursString;
  if (DateUtils.isFullDay(dateStart, dateEnd)) {
    hoursString = LangService.strings.CALENDAR_FULL_DAY;
  } else {
    const startTime = DateUtils.getHours(dateStart, currentLanguage);
    const endTime = DateUtils.getHours(dateEnd, currentLanguage);
    hoursString = `${startTime} - ${endTime}`;
  }

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => Linking.openURL(`${eventCalendarURL}/${slug}`)}
    >
      <View style={styles.imageWrapper}>
        <Image style={styles.listItemImage} source={image} />
      </View>
      <View style={styles.listItemHoursContainer}>
        <View style={styles.listItemHoursView}>
          <Text style={styles.listItemHoursText}>{hoursString}</Text>
        </View>
      </View>
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listLocationText}>{decodedLocationTitle}</Text>
        <Text style={styles.listItemTitle}>{name}</Text>
        <View>
          <Text
            style={styles.listItemDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CalendarEvent;
