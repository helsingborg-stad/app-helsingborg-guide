// @flow
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { addDays, subDays } from "date-fns";
import { throttle } from "lodash/function";

import CalendarEvent from "@shared-components/CalendarEvent";
import CalendarDatePicker from "@shared-components/CalendarDatePicker";
import Scrollable from "@shared-components/Scrollable";
import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";
import { showBottomBar } from "@actions/uiStateActions";
import { fetchEvents, fetchEventsReset } from "@actions/eventActions";
import { StyleSheetUtils } from "@utils";
import { trackScreen } from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    marginBottom: 100,
    paddingHorizontal: 4,
  },
  loadingSpinner: {
    flex: 1,
  },
  noContent: {
    backgroundColor: Colors.grayEA,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
  noContentText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      color: Colors.black26,
      fontWeight: "500",
      fontSize: 19,
      lineHeight: 22,
      textAlign: "center",
      width: "50%",
    },
  ]),

  navigationWrapper: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
    backgroundColor: "white",
  },

  navigation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },

  navigationBarWrapper: {
    flexDirection: "column",
  },

  navigationBarStep: {
    textAlign: "center",
  },
});

type LayoutProps = {
  children?: React.Node,
};

function Layout({ children }: LayoutProps) {
  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {children}
    </SafeAreaView>
  );
}

function NoContent() {
  return (
    <View style={{ ...styles.flex, ...styles.noContent }}>
      <Text style={styles.noContentText}>
        {LangService.strings.CALENDAR_NO_CONTENT}
      </Text>
    </View>
  );
}

type Props = {
  navigation: any,
  route: any,
};

const CalendarScreen = (props: Props) => {
  const { navigation, route } = props;

  const { params } = route || {};
  const { linkingCalendar } = useDeepLinking();
  const dispatch = useDispatch();
  const { currentLanguage } = useSelector((s) => s.navigation) || {};
  const { isFetching, items } = useSelector((s) => s.events) || {};
  const [chosenDate, setChosenDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [endOfContent, setEndOfContent] = useState(false);
  const [noEvents, setNoEvents] = useState(false);
  const noContent = !isFetching && noEvents;
  const [initiallyRendered, setInitiallyRendered] = useState(false);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    trackScreen("/calendar", "/calendar");
    dispatch(showBottomBar(true)),
      dispatch(
        fetchEvents(
          currentLanguage,
          chosenDate,
          chosenDate,
          ITEMS_PER_PAGE,
          currentPage
        )
      );
    return () => {
      dispatch(fetchEventsReset());
      setEvents([]);
      setEndOfContent(false);
      setCurrentPage(1);
      setChosenDate(new Date());
      setInitiallyRendered(false);
    };
  }, []);

  useEffect(() => {
    if (params?.id) {
      linkingCalendar(params);
    }
  }, [params]);

  const loadMoreContent = () => {
    throttle(() => {
      const nextPage = currentPage + 1;
      dispatch(
        fetchEvents(
          currentLanguage,
          chosenDate,
          chosenDate,
          ITEMS_PER_PAGE,
          nextPage
        )
      );
      setCurrentPage(nextPage);
    }, 2500)();
  };

  useEffect(() => {
    let copy = [...events];
    !initiallyRendered && setInitiallyRendered(true);
    if (items.length) {
      if (items !== copy) {
        setNoEvents(false);
        items.map(
          (item) =>
            !copy.some(
              (event) =>
                event.id === item.id ||
                (event.name === item.name &&
                  event.dateStart === item.dateStart &&
                  event.dateEnd === item.dateEnd &&
                  item.location?.title === event.location?.title)
            ) && copy.push(item)
        );
        setEvents(copy);
      }
    } else if (events.length) {
      setEndOfContent(true);
    } else {
      initiallyRendered && setNoEvents(true);
    }
  }, [items]);

  const getNextDate = () => {
    const nextDate = addDays(chosenDate, 1);
    setEvents([]);
    endOfContent && setEndOfContent(false);
    noEvents && setNoEvents(false);
    setCurrentPage(1);
    dispatch(
      fetchEvents(currentLanguage, nextDate, nextDate, ITEMS_PER_PAGE, 1)
    );
    setChosenDate(nextDate);
  };

  const getPrevDate = () => {
    const prevDate = subDays(chosenDate, 1);
    setEvents([]);
    endOfContent && setEndOfContent(false);
    noEvents && setNoEvents(false);
    setCurrentPage(1);
    dispatch(
      fetchEvents(currentLanguage, prevDate, prevDate, ITEMS_PER_PAGE, 1)
    );
    setChosenDate(prevDate);
  };

  const datePicker = (
    <CalendarDatePicker
      chosenDate={chosenDate}
      currentLanguage={currentLanguage}
      getNextDate={() => getNextDate()}
      getPrevDate={() => getPrevDate()}
    />
  );

  if (isFetching && !events.length) {
    return (
      <Layout>
        {datePicker}
        <ActivityIndicator style={styles.loadingSpinner} />
      </Layout>
    );
  }

  const isCloseToBottom = (e) => {
    const { layoutMeasurement, contentOffset, contentSize } = e;
    const paddingToBottom = 900;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const onRefresh = () => {
    dispatch(fetchEventsReset());
    setEvents([]);
    setEndOfContent(false);
    setCurrentPage(1);
    dispatch(
      fetchEvents(currentLanguage, chosenDate, chosenDate, ITEMS_PER_PAGE, 1)
    );
  };

  if (noContent) {
    return (
      <Layout>
        {datePicker}
        <NoContent />
      </Layout>
    );
  }

  return (
    <Layout>
      {datePicker}
      <Scrollable
        refreshControl={true}
        refreshAction={onRefresh}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !endOfContent) {
            loadMoreContent();
          }
        }}
      >
        <View style={styles.container}>
          {events.length
            ? events.map((event, index) =>
                event ? (
                  <CalendarEvent
                    key={index}
                    event={event}
                    currentLanguage={currentLanguage}
                    navigation={navigation}
                    path={"/calendar"}
                  />
                ) : null
              )
            : null}
          {isFetching && events.length && (
            <ActivityIndicator style={{ width: "100%", paddingBottom: 30 }} />
          )}
        </View>
      </Scrollable>
    </Layout>
  );
};

export default CalendarScreen;
