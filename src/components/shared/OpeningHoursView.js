// @flow

import React from "react";
import { Text, StyleSheet } from "react-native";
import LangService from "../../services/langService";
import { StyleSheetUtils } from "../../utils/";
import {
  Colors,
  TextStyles,
} from "../../styles/";

function getOpeningHours(openingList: OpenHour[], expList: OpenHourException[], now: Date) {
  if (!openingList || !openingList.length) return null;
  if (expList && expList.length) {
    const exp = expList.find(item => now.toDateString() === new Date(item.date).toDateString());
    if (exp) return exp.description;
  }

  const nowDay = now.getDay();
  const openingObj = openingList.find(item => item.dayNumber === nowDay);

  if (!openingObj) return null;

  if (openingObj.closed) return LangService.strings.CLOSE_TODAY;

  return `${LangService.strings.OPEN_TODAY} ${openingObj.opening}-${openingObj.closing}`;
}

const styles = StyleSheet.create({
  hoursText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "normal",
      lineHeight: 19,
      color: Colors.black,
    }],
  ),
});

type Props = {
  openHours: OpenHour[],
  openHoursException: OpenHourException[],
  now: Date,
}

export default function OpeningHoursView(props: Props) {
  const opening = getOpeningHours(props.openHours, props.openHoursException, props.now);
  const text = opening || "";

  return (
    <Text style={styles.hoursText}>{text}</Text>
  );
}
