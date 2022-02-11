// @flow
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";
import { DateUtils } from "@utils";
import { isToday } from "date-fns";

const styles = StyleSheet.create({
  datePickerContainer: {
    ...Platform.select({
      android: {
        paddingTop: 16
      }
    }),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 7,
    width: "70%"
  },
  datePickerText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 18,
      fontWeight: "500",
      fontStyle: "normal",
      color: Colors.black26
    }
  ])
});

type Props = {
  chosenDate: Date,
  currentLanguage: string,
  getNextDate: () => void,
  getPrevDate: () => void
};

function CalendarDatePicker({
  chosenDate,
  currentLanguage,
  getNextDate,
  getPrevDate
}: Props) {
  const dateFmt = DateUtils.longDate(chosenDate, currentLanguage);
  const chosenDateIsToday = isToday(chosenDate);
  const prevBtnOpacity = chosenDateIsToday ? 0.3 : 1;
  const prevBtnStyles = { opacity: prevBtnOpacity };
  return (
    <View style={styles.datePickerContainer}>
      <TouchableOpacity
        onPress={getPrevDate}
        disabled={chosenDateIsToday}
        style={prevBtnStyles}
      >
        <Icon name="chevron-left" size={34} color="black" />
      </TouchableOpacity>
      <Text style={styles.datePickerText}>{dateFmt}</Text>
      <TouchableOpacity onPress={getNextDate}>
        <Icon name="chevron-right" size={34} color="black" />
      </TouchableOpacity>
    </View>
  );
}
export default CalendarDatePicker;
