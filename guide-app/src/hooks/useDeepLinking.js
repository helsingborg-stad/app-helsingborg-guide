import { useDispatch, useSelector } from "react-redux";
import { decode } from "html-entities";
import {
  showBottomBar,
  selectCurrentBottomBarTab,
  selectCurrentSharingLink,
} from "@actions/uiStateActions";
import { eventCalendarURL } from "@data/urls";
import useGuides from "@hooks/useGuides"
import LangService from "@services/langService";
import Navigation from "@services/navigationService";
import { DateUtils } from "@utils";
import { DEEP_LINKING_URL } from "@data/endpoints"
const defaultImage = require("@assets/images/no-image-featured-image.png");


const useDeepLinking = () => {
  const dispatch = useDispatch();
  const { navigation, events } = useSelector(s => s);
  const { navigationCategories, currentLanguage } = navigation;
  const { linkToGuide } = useGuides();

  const linkingHome = async (params) => {
    const { id_1 } = params;
    if (id_1) {
      let item;
      navigationCategories.map(category => {
        let temp;
        temp = category.items.find(group => group.id.toString() === id_1.toString());
        if (temp) {
          item = temp;
        }
      });
      dispatch(selectCurrentBottomBarTab(0));
      dispatch(showBottomBar(false));
      linkToGuide(item, params);
    }
  };

  const linkingCalendar = async (params) => {
    const { items } = events;
    const { id } = params;
    dispatch(selectCurrentBottomBarTab(1));
    let foundEvent = items.find(event => event.id === id);
    if (foundEvent) {
      const {
        imageUrl,
        location,
        slug,
        dateStart,
        dateEnd,
        id
      } = foundEvent;

      const image = imageUrl ? { uri: imageUrl } : defaultImage;
      const decodedLocationTitle = decode(location.title, {
        level: "xml",
      });
      let hoursString;
      if (DateUtils.isFullDay(dateStart, dateEnd)) {
        hoursString = LangService.strings.CALENDAR_FULL_DAY;
      } else {
        const startTime = DateUtils.getHours(dateStart, currentLanguage);
        const endTime = DateUtils.getHours(dateEnd, currentLanguage);
        hoursString = `${startTime} - ${endTime}`;
      }
      const eventLinkDate = DateUtils.eventLinkDate(dateStart);
      const eventLinkDay = DateUtils.eventLinkDay(dateStart);
      const dateString = DateUtils.eventTime(dateStart);
      const eventUrl = `${eventCalendarURL}/${slug}?date=${eventLinkDate}`;
      const newPath = `$/calendar/${slug || decodedLocationTitle}`;

      let sharePath = DEEP_LINKING_URL + `calendar/${id}/`;

      dispatch(selectCurrentSharingLink(sharePath));

      Navigation.navigate("CalendarDetailsScreen", {
        event: {...foundEvent, eventUrl: eventUrl, hoursString: hoursString, imageUrl: image, title: decodedLocationTitle, date: eventLinkDay, dateString: dateString},
        path: newPath,
      });
    }
  }
  return { linkingHome, linkingCalendar };
};

export default useDeepLinking;
