import { useDispatch, useSelector } from "react-redux";
import { decode } from "html-entities";
import {
  showBottomBar,
  selectCurrentBottomBarTab,
  selectCurrentSharingLink
} from "@actions/uiStateActions";
import { eventCalendarURL } from "@data/urls";
import useGuides from "@hooks/useGuides";
import LangService from "@services/langService";
import { DateUtils } from "@utils";
import * as Navigation from "@utils/NavigationUtils";
import { DEEP_LINKING_URL } from "@data/endpoints";

const defaultImage = require("@assets/images/no-image-featured-image.png");


const useDeepLinking = () => {
  const dispatch = useDispatch();
  const { navigation, events } = useSelector(s => s);
  const { navigationCategories, currentLanguage } = navigation;
  const { linkToGuide } = useGuides();

  const linkingHome = async (params) => {
    const { id_1 } = params;
    if (id_1) {
      console.log("id_1: " + id_1, navigationCategories);
      let item;
      let temp;
      navigationCategories.map(category => {
        let idMatch = category.items.find(group => group.id.toString() === id_1.toString());
        if (idMatch) {
          temp = idMatch;
        }
      });

      if (temp?.guide || temp?.guidegroup || temp?.guideGroup || temp?.interactiveGuide) {
        item = temp;
      } else {
        Navigation.navigate("NotFoundScreen");
      }
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
        level: "xml"
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
        event: {
          ...foundEvent,
          eventUrl: eventUrl,
          hoursString: hoursString,
          imageUrl: image,
          title: decodedLocationTitle,
          date: eventLinkDay,
          dateString: dateString
        },
        path: newPath
      });
    }
  };

  const clearLinking = (navigation, params) => {
    const objParams = params ? Object.fromEntries(params.map(key => [key, null])) : {};

    navigation.setParams({ id_1: null, id_2: null, id_3: null, ...objParams });
  };
  return { linkingHome, linkingCalendar, clearLinking };
};

export default useDeepLinking;
