import React, { useState } from "react";
import { View, Text } from "react-native";
import { Checkbox } from "react-native-paper";
import { CalendarProps } from "react-native-calendars"
import Calendar from "@shared-components/Calendar";
import Dateutils from "@utils/DateUtils";
import styles from "./style";

const options = [
  {
    title: "Morgon",
    date: "08:00  - 12:00",
  },
  {
    title: "Eftermiddag",
    date: "12:00  - 18:00",
  },
  {
    title: "Kväll",
    date: "18:00  - 24:00",
  },
];

const INITIAL_DATE = "2022-03-20"

const Time = (props) => {
  const { renderCalendar } = props;
  const [selected, setSelected] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  const onValueChange = (option) => {
    const copy = [...selected];
    !copy.includes(option) ? copy.push(option) : copy.splice(copy.indexOf(option), 1);
    setSelected(copy);
  };

  const onDayPress: CalendarProps['onDayPress'] = day => {
    let copy = {...markedDates};
    const date = new Date(day.dateString);
    // const prev = Dateutils.shortDate(Dateutils.prevDate(date))
    // const next = Dateutils.shortDate(Dateutils.nextDate(date))

    if (copy.hasOwnProperty(day.dateString)) {
      delete copy[day.dateString];
    }

    else {
      copy[day.dateString] = {selected: true, marked: true, selectedColor: "#A71580", color: "#A71580"}
      // if (copy.hasOwnProperty(prev) && copy.hasOwnProperty(next)) {
      //   console.log("lol??+")
      //   copy[prev] = {...copy[prev], startingDay: true}
      //   copy[next] = {...copy[next], endingDay: true}
      //   console.log(copy)
      // }
    }
    setMarkedDates(copy);

  }

  return (
    <View style={styles.time}>
      <View style={styles.intervals}>
      {options.map((option, index) => (
        <View style={styles.intervalItem}>
          <Checkbox.Android
            key={index}
            status={selected.includes(option) ? "checked" : "unchecked"}
            onPress={() => onValueChange(option)}
            uncheckedColor={"grey"}
            color={"#A40082"}
            mode={"android"}
          />
          <View style={styles.intervalTextContainer}>
            <Text style={[styles.timePrefix, selected.includes(option) && styles.bold]}>{option.title}</Text>
            <Text style={[styles.timeDate, selected.includes(option) && styles.bold]}>{option.date}</Text>
          </View>
        </View>
      ))}
      </View>
      <View style={styles.calendar}>
        {renderCalendar &&
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            dayTextColor: '#262626',
            textSectionTitleColor: '#262626',
            monthTextColor: '#000000',
          }}
        />
        }
      </View>
    </View>
  );
};

export default Time;
