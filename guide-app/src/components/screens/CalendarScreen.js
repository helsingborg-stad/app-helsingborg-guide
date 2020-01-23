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
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";

import CalendarEvent from "@shared-components/CalendarEvent";
import CalendarDatePicker from "@shared-components/CalendarDatePicker";
import { Colors } from "@assets/styles";
import { showBottomBar } from "@actions/uiStateActions";
import { fetchEvents } from "@actions/eventActions";

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
  loadingSpinner: {
    height: "100%",
    width: "100%"
  }
});

type LayoutProps = {
  children?: React.Node
};

function Layout({ children }: LayoutProps) {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      {children}
    </SafeAreaView>
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
      <CalendarDatePicker
        chosenDate={chosenDate}
        currentLanguage={currentLanguage}
        getNextDate={() => this.getNextDate()}
        getPrevDate={() => this.getPrevDate()}
      />
    );

    // TODO: extract actual content to new component
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
          <Text>No CONTENT</Text>
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
