import React, { useState } from "react";
import { View, Text } from "react-native";
import { Checkbox } from "react-native-paper";
import { CalendarProps } from "react-native-calendars";
import Calendar from "@shared-components/Calendar";
import styles from "./style";
import LangService from "@services/langService";

const options = [
  {
    title: "MORNING",
    date: "08:00  - 12:00",
  },
  {
    title: "AFTERNOON",
    date: "12:00  - 18:00",
  },
  {
    title: "EVENING",
    date: "18:00  - 24:00",
  },
];

const INITIAL_DATE = "2022-03-20";

const Time = (props) => {
  const { renderCalendar, selected, setSelected } = props;
  const [markedDates, setMarkedDates] = useState({});

  const onValueChange = (option) => {
    const copy = { ...selected };
    !copy.dates.includes(option)
      ? copy.dates.push(option)
      : copy.dates.splice(copy.dates.indexOf(option), 1);
    setSelected(copy);
  };

  const onDayPress: CalendarProps["onDayPress"] = (day) => {
    let copy = { ...markedDates };
    // const prev = Dateutils.shortDate(Dateutils.prevDate(date))
    // const next = Dateutils.shortDate(Dateutils.nextDate(date))

    if (copy.hasOwnProperty(day.dateString)) {
      delete copy[day.dateString];
    } else {
      copy[day.dateString] = {
        selected: true,
        marked: true,
        selectedColor: "#A71580",
        color: "#A71580",
      };
      // if (copy.hasOwnProperty(prev) && copy.hasOwnProperty(next)) {
      //   copy[prev] = {...copy[prev], startingDay: true}
      //   copy[next] = {...copy[next], endingDay: true}
      // }
    }
    setMarkedDates(copy);
  };

  return (
    <View style={styles.time}>
      <View style={styles.intervals}>
        {options.map((option, index) => (
          <View key={index} style={styles.intervalItem}>
            <Checkbox.Android
              key={index}
              status={selected.dates.includes(option) ? "checked" : "unchecked"}
              onPress={() => onValueChange(option)}
              uncheckedColor={"grey"}
              color={"#A40082"}
              mode={"android"}
            />
            <View style={styles.intervalTextContainer}>
              <Text
                style={[
                  styles.timePrefix,
                  selected.dates.includes(option) && styles.bold,
                ]}
              >
                {LangService.strings[option.title]}
              </Text>
              <Text
                style={[
                  styles.timeDate,
                  selected.dates.includes(option) && styles.bold,
                ]}
              >
                {option.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.calendar}>
        {renderCalendar && (
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              dayTextColor: "#262626",
              textSectionTitleColor: "#262626",
              monthTextColor: "#000000",
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Time;
