import React, { Component } from "react";
import {
  PropTypes,
} from "prop-types";
import {
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";
import ViewContainer from "./components/shared/view_container";
import NotificationBar from "./components/shared/NotificationBar";
import {
  SplashScreen,
  MapScreen,
  LocationDetailsScreen,
  GuideDetailsScreen,
  WelcomeScreen,
  LocationOnMapScreen,
  ObjectDetailsScreen,
  WebScreen,
  VideoScreen,
  ImageScreen,
  DownloadsScreen,
  SettingsScreen,
} from "./components/screens/";
import {
  Colors,
  TextStyles,
} from "./styles/";
import AnalyticsUtils from "./utils/AnalyticsUtils";

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors.darkPurple,
  },
});

const headerStyle = {
  navigationOptions: {
    headerStyle: styles.headerStyle,
    headerTintColor: Colors.white,
    headerTitleStyle: TextStyles.headerTitleLabel,
    headerBackTitleStyle: TextStyles.defaultFontFamily,
  },
};

const GuideNavigator = StackNavigator(
  {
    MapScreen: { screen: MapScreen },
    LocationDetailsScreen: { screen: LocationDetailsScreen },
    GuideDetailsScreen: { screen: GuideDetailsScreen },
    LocationOnMapScreen: { screen: LocationOnMapScreen },
    ObjectDetailsScreen: { screen: ObjectDetailsScreen },
    WebScreen: { screen: WebScreen },
    VideoScreen: { screen: VideoScreen },
    ImageScreen: { screen: ImageScreen },
    DownloadsScreen: { screen: DownloadsScreen },
    SettingsScreen: { screen: SettingsScreen },
  },
  headerStyle,
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

  static displayNotificationBar() {
    return <NotificationBar style={{ bottom: 0 }} />;
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
        {Nav.displayNotificationBar()}
      </ViewContainer>
    );
  }
}
