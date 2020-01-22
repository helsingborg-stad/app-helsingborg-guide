// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { XmlEntities } from "html-entities";

import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";
import { showBottomBar } from "@actions/uiStateActions";
import { fetchEvents } from "@actions/eventActions";
import { StyleSheetUtils } from "@utils";
import { eventCalendarURL } from "@data/urls";

const defaultImage = require("@assets/images/no-image-featured-image.png");

type Props = {
  navigation: any,
  items: Event[],
  showLoadingSpinner: boolean,
  noContent: boolean,
  currentLanguage: string,
  dispatchShowBottomBar(visible: boolean): void,
  getEvents(currentLanguage: string, dateStart: Date, dateEnd: Date): void
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    marginBottom: 100,
    paddingHorizontal: 4
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15
  },
  datePickerText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "500",
      fontStyle: "normal",
      color: Colors.black26
    }
  ]),
  item: {
    marginBottom: 30,
    padding: 4,
    width: "50%"
  },
  listItemImage: {
    height: 205,
    aspectRatio: 205 / 175
  },
  imageWrapper: {
    overflow: "hidden",
    alignItems: "stretch"
  },
  listItemTextContainer: {
    alignItems: "center"
  },
  listItemHoursContainer: {
    alignItems: "center",
    marginTop: -10,
    marginBottom: 8
  },
  listItemHoursView: {
    borderRadius: 4,
    backgroundColor: Colors.white,
    paddingTop: 5,
    paddingBottom: 4,
    paddingHorizontal: 15,
    shadowRadius: 12,
    shadowColor: "black",
    shadowOpacity: 0.16
  },
  listItemHoursText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 13,
      lineHeight: 13,
      fontWeight: "500",
      fontStyle: "normal",
      color: Colors.black
    }
  ]),
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      lineHeight: 16,
      fontWeight: "900",
      fontStyle: "normal",
      color: Colors.black26,
      paddingBottom: 12
    }
  ]),
  listLocationText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      fontWeight: "500",
      lineHeight: 12,
      letterSpacing: 0.75,
      textTransform: "uppercase",
      color: Colors.gray3,
      padding: 5
    }
  ]),
  listItemDescription: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 13,
      lineHeight: 13,
      fontWeight: "normal",
      fontStyle: "normal",
      color: Colors.gray2C,
      textAlign: "center"
    }
  ])
});

function DatePicker({}) {
  return (
    <View style={styles.datePickerContainer}>
      <Icon name="chevron-left" size={30} color="black" />
      <Text style={styles.datePickerText}>{new Date().toDateString()}</Text>
      <Icon name="chevron-right" size={30} color="black" />
    </View>
  );
}

function EventItem({ event }: { event: Event }) {
  const {
    description,
    id,
    imageUrl,
    location,
    name,
    slug,
    dateStart,
    dateEnd
  } = event;
  const image = imageUrl ? { uri: imageUrl } : defaultImage;

  const entities = new XmlEntities();
  const decodedLocationTitle = entities.decode(location.title);
  // TODO: use date-fns or similar
  const startTime = dateStart.substring(11, 16);
  const endTime = dateEnd.substring(11, 16);

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => Linking.openURL(`${eventCalendarURL}/${slug}`)}
    >
      <View style={styles.imageWrapper}>
        <Image style={styles.listItemImage} source={image} />
      </View>
      <View style={styles.listItemHoursContainer}>
        <View style={styles.listItemHoursView}>
          <Text style={styles.listItemHoursText}>
            {startTime} - {endTime}
          </Text>
        </View>
      </View>
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listLocationText}>{decodedLocationTitle}</Text>
        <Text style={styles.listItemTitle}>{name}</Text>
        <View>
          <Text
            style={styles.listItemDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

class CalendarScreen extends Component<Props> {
  static navigationOptions = () => {
    return { headerShown: false };
  };

  componentDidMount() {
    const { currentLanguage, dispatchShowBottomBar, getEvents } = this.props;
    dispatchShowBottomBar(true);
    const dateToday = new Date();
    getEvents(currentLanguage, dateToday, dateToday);
  }

  render() {
    const { noContent, showLoadingSpinner, items } = this.props;

    if (showLoadingSpinner) {
      return <ActivityIndicator style={styles.loadingSpinner} />;
    }

    if (noContent) {
      return <Text>No CONTENT</Text>;
    }

    return (
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <DatePicker />
        <ScrollView>
          <View style={styles.container}>
            {items.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { navigation, events } = state;
  const { currentLanguage } = navigation;
  const { isFetching, items } = events;

  const noContent = items.length === 0;

  return {
    showLoadingSpinner: isFetching,
    currentLanguage,
    items,
    noContent
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getEvents: (currentLanguage: string, dateStart: Date, dateEnd: Date) =>
      dispatch(fetchEvents(currentLanguage, dateStart, dateEnd)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
