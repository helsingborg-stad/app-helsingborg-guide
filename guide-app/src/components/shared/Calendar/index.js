import React from "react";
import {
  Calendar as CalendarPicker,
} from "react-native-calendars";

import ArrowLeft from "@assets/images/arrow_left";
import ArrowRight from "@assets/images/arrow_right";

const Calendar = (props) => {

  const {
    current,
    minDate,
    maxDate,
    onDayPress,
    onDayLongPress,
    monthFormat,
    onMonthChange,
    hideArrow,
    markedDates,
    markingType,
    theme,
  } = props;

  console.log("theme", theme)

  return (
    <CalendarPicker
      renderArrow={(direction) => direction === "left" ? <ArrowLeft /> : <ArrowRight />}
      onDayPress={(date) => onDayPress && onDayPress(date) || null}
      onDayLongPress={(date) => onDayLongPress && onDayLongPress(date) || null}
      hideArrow={!!hideArrow}
      markedDates={markedDates}
      {...(markingType && { markingType: markingType })}
      {...(theme && { theme: theme })}
    />
  )
}

export default Calendar;
