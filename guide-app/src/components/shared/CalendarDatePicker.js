// @flow
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";
import { DateUtils } from "@utils";

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15
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
  // TODO: :)
  getNextDate: any,
  getPrevDate: any
};

function CalendarDatePicker({
  chosenDate,
  currentLanguage,
  getNextDate,
  getPrevDate
}: Props) {
  const dateFmt = DateUtils.longDate(chosenDate, currentLanguage);
  return (
    <View style={styles.datePickerContainer}>
      <TouchableOpacity onPress={getPrevDate}>
        <Icon name="chevron-left" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.datePickerText}>{dateFmt}</Text>
      <TouchableOpacity onPress={getNextDate}>
        <Icon name="chevron-right" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}
export default CalendarDatePicker;
