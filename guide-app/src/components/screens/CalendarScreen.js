// @flow
import * as React from "react";
import { Component } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { addDays, subDays } from "date-fns";

import CalendarEvent from "@shared-components/CalendarEvent";
import CalendarDatePicker from "@shared-components/CalendarDatePicker";
import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";
import { showBottomBar } from "@actions/uiStateActions";
import { fetchEvents } from "@actions/eventActions";
import { StyleSheetUtils } from "@utils";

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
    opacity: 0.6
  },
  noContentText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      color: Colors.black26,
      fontWeight: "500",
      fontSize: 19,
      lineHeight: 22,
      textAlign: "center",
      width: "50%"
    }
  ])
});

type LayoutProps = {
  children?: React.Node
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
    const nextDate = addDays(chosenDate, 1);
    getEvents(currentLanguage, nextDate, nextDate);
    this.setState({ chosenDate: nextDate });
  };

  getPrevDate = () => {
    const { currentLanguage, getEvents } = this.props;
    const { chosenDate } = this.state;
    const prevDate = subDays(chosenDate, 1);
    getEvents(currentLanguage, prevDate, prevDate);
    this.setState({ chosenDate: prevDate });
  };

  render() {
    const {
      currentLanguage,
      noContent,
      showLoadingSpinner,
      items,
      navigation,
    } = this.props;
    const { chosenDate } = this.state;

    const datePicker = (
      <CalendarDatePicker
        chosenDate={chosenDate}
        currentLanguage={currentLanguage}
        getNextDate={() => this.getNextDate()}
        getPrevDate={() => this.getPrevDate()}
      />
    );

    if (showLoadingSpinner) {
      return (
        <Layout>
          {datePicker}
          <ActivityIndicator style={styles.loadingSpinner} />
        </Layout>
      );
    }

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
        <ScrollView>
          <View style={styles.container}>
            {items.map(event => (
              <CalendarEvent
                key={event.id}
                event={event}
                currentLanguage={currentLanguage}
                navigation={navigation}
              />
            ))}
          </View>
        </ScrollView>
      </Layout>
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
