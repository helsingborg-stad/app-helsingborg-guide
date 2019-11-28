import LangService from "./langService";

/* TODO:  phase out */

export default {
  getOpeningHours(openingList, expList) {
    const now = new Date();

    if (!openingList || !openingList.length) {
      return null;
    }
    if (expList && expList.length) {
      const exp = expList.find(
        item =>
          now.toDateString() === new Date(item.exception_date).toDateString()
      );
      if (exp) {
        return exp.exeption_information;
      }
    }

    const nowDay = now.getDay().toString();
    const openingObj = openingList.find(item => item.day_number === nowDay);

    if (!openingObj) {
      return null;
    }

    if (openingObj.closed) {
      return LangService.strings.CLOSE_TODAY;
    }

    return `${LangService.strings.OPEN_TODAY} ${openingObj.opening}-${
      openingObj.closing
    }`;
  }
};
