import React, { useEffect, useReducer } from "react";
import {
  Calendar as CalendarPicker,
  LocaleConfig,
} from "react-native-calendars";

import ArrowLeft from "@assets/images/arrow_left";
import ArrowRight from "@assets/images/arrow_right";
import LangService from "@services/langService";


LocaleConfig.locales.en = LocaleConfig.locales[''];
LocaleConfig.locales.de = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'July',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mär.',
    'Apr.',
    'Mai',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sept.',
    'Okt.',
    'Nov.',
    'Dez.',
  ],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
};

LocaleConfig.locales.sv = {
  monthNames: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'Maj',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Okt.',
    'Nov.',
    'Dec.',
  ],
  dayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
  dayNamesShort: ['Sön.', 'Mån.', 'Tis.', 'Ons.', 'Tors.', 'Fre.', 'Lör.'],
};


const Calendar = (props) => {

  const [_, forceUpdate] = useReducer((x) => x + 1, 0);


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

  useEffect(() => {
    LocaleConfig.defaultLocale = LangService.code;
    forceUpdate();
  },[LangService.code])



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
