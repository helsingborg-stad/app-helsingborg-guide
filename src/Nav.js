import React, { Component } from "react";
import {
  StatusBar,
  Platform,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";
import {
  DownloadsScreen,
  GuideDetailsScreen,
  GuideListScreen,
  ImageScreen,
  LocationScreen,
  ObjectDetailsScreen, /* old */
  ObjectScreen, /* new */
  SettingsScreen,
  SplashScreen,
  TrailScreen,
  VideoScreen,
  WebScreen,
  WelcomeScreen,
} from "screens";
import ViewContainer from "./components/shared/view_container";
import {
  Colors,
  HeaderStyles,
} from "./styles/";
import AnalyticsUtils from "./utils/AnalyticsUtils";

const GuideNavigator = StackNavigator(
  {
    GuideListScreen: { screen: GuideListScreen },
    TrailScreen: { screen: TrailScreen },
    LocationScreen: { screen: LocationScreen },
    GuideDetailsScreen: { screen: GuideDetailsScreen },
    ObjectDetailsScreen: { screen: ObjectDetailsScreen }, /* old */
    ObjectScreen: { screen: ObjectScreen }, /* new */
    WebScreen: { screen: WebScreen },
    VideoScreen: { screen: VideoScreen },
    ImageScreen: { screen: ImageScreen },
    DownloadsScreen: { screen: DownloadsScreen },
    SettingsScreen: { screen: SettingsScreen },
  },
  { navigationOptions: HeaderStyles.default },
);

const RootNavigator = StackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    WelcomeScreen: { screen: WelcomeScreen },
    MainScreen: { screen: GuideNavigator },
  },
  {
    headerMode: "none",
  },
);

const ios = Platform.OS === "ios";

// TODO this class should most likely be merged into App (index.js)
export default class Nav extends Component {
  static getCurrentRouteName(navigationState) {
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

  static onNavigationStateChange(prevState, currentState) {
    const currentScreen = Nav.getCurrentRouteName(currentState);
    const prevScreen = Nav.getCurrentRouteName(prevState);

    if (prevScreen !== currentScreen) {
      AnalyticsUtils.setScreen(currentScreen);
    }
  }

  render() {
    return (
      <ViewContainer>
        <StatusBar
          translucent={ios}
          barStyle="light-content"
          backgroundColor={Colors.darkPurple}
        />
        <RootNavigator onNavigationStateChange={Nav.onNavigationStateChange} />
      </ViewContainer>
    );
  }
}
