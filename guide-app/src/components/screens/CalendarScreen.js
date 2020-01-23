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
import { DateUtils } from "@utils";

const defaultImage = require("@assets/images/no-image-featured-image.png");

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
      fontSize: 18,
      fontWeight: "500",
      fontStyle: "normal",
      color: Colors.black26
    }
  ]),
  loadingSpinner: {
    height: "100%",
    width: "100%"
  },
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
    marginBottom: 4
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
  listLocationText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "500",
      letterSpacing: 0.75,
      textTransform: "uppercase",
      color: Colors.gray3,
      padding: 5,
      textAlign: "center"
    }
  ]),
  listItemTitle: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 16,
      fontWeight: "900",
      fontStyle: "normal",
      color: Colors.black26,
      paddingBottom: 8,
      textAlign: "center",
      width: "80%"
    }
  ]),
  listItemDescription: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      fontSize: 13,
      lineHeight: 15,
      letterSpacing: 0.19,
      fontWeight: "normal",
      fontStyle: "normal",
      color: Colors.gray2C,
      textAlign: "center",
      paddingHorizontal: 4
    }
  ])
});

function DatePicker({
  chosenDate,
  currentLanguage,
  getNextDate,
  getPrevDate
}: {
  chosenDate: Date,
  currentLanguage: string,
  getNextDate: any,
  getPrevDate: any
}) {
  const dateFmt = DateUtils.longDate(chosenDate, currentLanguage);
  return (
    <View style={styles.datePickerContainer}>
      <TouchableOpacity onPress={getPrevDate}>
        <Icon name="chevron-left" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.datePickerText}>{dateFmt}</Text>
      <TouchableOpacity onPress={getNextDate}>
        <Icon name="chevron-right" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function EventItem({
  event,
  currentLanguage
}: {
  event: Event,
  currentLanguage: string
}) {
  const {
    description,
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
  const startTime = DateUtils.getHours(dateStart, currentLanguage);
  const endTime = DateUtils.getHours(dateEnd, currentLanguage);

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

type Props = {
  navigation: any,
  items: Event[],
  showLoadingSpinner: boolean,
  noContent: boolean,
  currentLanguage: string,
  dispatchShowBottomBar(visible: boolean): void,
  getEvents(currentLanguage: string, dateStart: Date, dateEnd: Date): void
};

type State = {
  chosenDate: Date
};

class CalendarScreen extends Component<Props, State> {
  static navigationOptions = () => {
    return { headerShown: false };
  };

  constructor(props: Props) {
    super(props);

    const chosenDate = new Date();
    this.state = { chosenDate };
  }

  componentDidMount() {
    const { currentLanguage, dispatchShowBottomBar, getEvents } = this.props;
    const { chosenDate } = this.state;
    dispatchShowBottomBar(true);
    getEvents(currentLanguage, chosenDate, chosenDate);
  }

  getNextDate = () => {
    const { currentLanguage, getEvents } = this.props;
    const { chosenDate } = this.state;
    const nextDate = new Date();
    nextDate.setDate(chosenDate.getDate() + 1);
    getEvents(currentLanguage, nextDate, nextDate);
    this.setState({ chosenDate: nextDate });
  };

  getPrevDate = () => {
    const { currentLanguage, getEvents } = this.props;
    const { chosenDate } = this.state;
    const prevDate = new Date();
    prevDate.setDate(chosenDate.getDate() - 1);
    getEvents(currentLanguage, prevDate, prevDate);
    this.setState({ chosenDate: prevDate });
  };

  render() {
    const {
      currentLanguage,
      noContent,
      showLoadingSpinner,
      items
    } = this.props;
    const { chosenDate } = this.state;

    const datePicker = (
      <DatePicker
        chosenDate={chosenDate}
        currentLanguage={currentLanguage}
        getNextDate={() => this.getNextDate()}
        getPrevDate={() => this.getPrevDate()}
      />
    );

    // TODO: extract actual content to new component
    if (showLoadingSpinner) {
      return (
        <SafeAreaView>
          <StatusBar barStyle="dark-content" />
          {datePicker}
          <ActivityIndicator style={styles.loadingSpinner} />
        </SafeAreaView>
      );
    }

    if (noContent) {
      return (
        <SafeAreaView>
          <StatusBar barStyle="dark-content" />
          {datePicker}
          <Text>No CONTENT</Text>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        {datePicker}
        <ScrollView>
          <View style={styles.container}>
            {items.map(event => (
              <EventItem
                key={event.id}
                event={event}
                currentLanguage={currentLanguage}
              />
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
