// @flow
import { de, en, sv } from "date-fns/locale";
import { format } from "date-fns";

const locales = { de, en, sv };

// Dates from the API is always UTC
function longDate(date: Date, locale: string): string {
  return format(new Date(date), "PP", { locale: locales[locale] });
}

function shortDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// https://date-fns.org/v2.9.0/docs/I18n
function getHours(date: string, locale: string): string {
  return format(new Date(date), "kk:mm", { locale: locales[locale] });
}

export default {
  getHours,
  longDate,
  shortDate
};
