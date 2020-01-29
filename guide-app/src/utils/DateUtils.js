// @flow
import { de, en, sv } from "date-fns/locale";
import { format, isEqual, startOfDay } from "date-fns";

const locales = { de, en, sv };

// Dates from the API is always UTC
function longDate(date: Date, locale: string): string {
  return format(new Date(date), "d MMMM yyyy", { locale: locales[locale] });
}

function shortDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// https://date-fns.org/v2.9.0/docs/I18n
function getHours(date: string, locale: string): string {
  return format(new Date(date), "kk:mm", { locale: locales[locale] });
}

function isFullDay(start: string, end: string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (
    isEqual(startDate, startOfDay(startDate)) &&
    isEqual(endDate, startOfDay(endDate))
  );
}

export default {
  getHours,
  isFullDay,
  longDate,
  shortDate
};
