// @flow
import React, { Component } from "react";
import { AppState, StatusBar, Platform, View } from "react-native";
import { connect } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import {
  CalendarScreen,
  DebugScreen,
  DownloadsScreen,
  GuideScreen,
  HomeScreen,
  ImageScreen,
  CategoryMapScreen,
  LocationScreen,
  ObjectScreen,
  QuizScreen,
  QuizResultScreen,
  SearchObjectScreen,
  SettingsScreen,
  SplashScreen,
  TrailScreen,
  VideoScreen,
  WebScreen,
  WelcomeScreen,
  ARIntroductionScreen,
} from "@src/components/screens";
import CalendarDetailsScreen from "@src/components/screens/CalendarDetailsScreen";
import ScanScreen from "@src/components/screens/ScanScreen";
import SegmentControlPill from "@shared-components/SegmentControlPill";
import ViewContainer from "@shared-components/view_container";
import BottomBarView from "@shared-components/BottomBarView";
import { Colors, HeaderStyles } from "@assets/styles";
import AnalyticsUtils from "@utils/AnalyticsUtils";
import NavigatorService from "@services/navigationService";
import { initializeTracker, trackScreen } from "@utils/MatomoUtils";


const GuideNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        backgroundColor: "#FFFFFF",
        headerMode: "screen",
        headerTitle: "Guide Helsingborg",
        header: () => null,

      },
    },
    TrailScreen: { screen: TrailScreen },
    LocationScreen: {
      screen: LocationScreen,
      navigationOptions: {
        headerMode: "screen",
      },
    },
    ObjectScreen: { screen: ObjectScreen },
    QuizScreen: { screen: QuizScreen },
    QuizResultScreen: { screen: QuizResultScreen },
    GuideDetailsScreen: {
      screen: GuideScreen,
      navigationOptions: {
        headerMode: "screen",
      },
    },
    WebScreen: { screen: WebScreen },
    VideoScreen: { screen: VideoScreen },
    ImageScreen: {
      screen: ImageScreen,
      navigationOptions: {
        headerMode: "none",
        title: '',
      },
    },
    DownloadsScreen: { screen: DownloadsScreen },
    SettingsScreen: { screen: SettingsScreen },
    ScanScreen: { screen: ScanScreen },
    DebugScreen: { screen: DebugScreen },
    CategoryMapScreen: { screen: CategoryMapScreen },
    CalendarScreen: { screen: CalendarScreen },
    CalendarDetailsScreen: { screen: CalendarDetailsScreen },
  },
  { defaultNavigationOptions: HeaderStyles.default },
);

const RootNavigator = createStackNavigator(
  {
    SplashScreen: { screen: SplashScreen,  },
    WelcomeScreen: { screen: WelcomeScreen },
    MainScreen: { screen: GuideNavigator },
    SearchObjectScreen: { screen: SearchObjectScreen },
    ARIntroductionScreen: { screen: ARIntroductionScreen },
  },
  {
    headerMode: "none",
    mode: "modal",
  },
);

const NavigatorWrapper = createAppContainer(RootNavigator);

const ios = Platform.OS === "ios";

type AppStateStatus = "inactive" | "active" | "background";

type Props = {
  onAppStarted(): void,
  onAppBecameActive(): void,
  onAppBecameInactive(): void,
};

class Nav extends Component<Props> {
  static getCurrentRouteName(navigationState: Object) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return Nav.getCurrentRouteName(route);
    }
    return route.routeName;
  }

  static onNavigationStateChange(prevState: Object, currentState: Object) {
    const currentScreen = Nav.getCurrentRouteName(currentState);
    const prevScreen = Nav.getCurrentRouteName(prevState);
    if (prevScreen !== currentScreen) {
      // trackScreen(("/" + currentScreen), currentScreen)
      // AnalyticsUtils.setScreen(currentScreen);
    }
  }

  componentDidMount = () => {
    this.props.onAppStarted();
    initializeTracker();
    AppState.addEventListener("change", this.onAppStateChange);
  };

  onAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      this.props.onAppBecameActive();
    } else if (nextAppState === "inactive") {
      this.props.onAppBecameInactive();
    }
  };

  render() {

    return (
      <ViewContainer>
        <StatusBar
          translucent={ios}
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        {/* $FlowFixMe should be fixed in later flow versions */}
        <NavigatorWrapper
          onNavigationStateChange={Nav.onNavigationStateChange}
          ref={(navigatorRef) => {
            NavigatorService.setContainer(navigatorRef);
          }}
        />
        <BottomBarView />
      </ViewContainer>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { geolocation } = state;
  return {
    geolocation
  };
}

export default connect(mapStateToProps)(Nav);
