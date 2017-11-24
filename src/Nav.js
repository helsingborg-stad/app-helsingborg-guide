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
  TabNavigator,
} from "react-navigation";
import ViewContainer from "./components/shared/view_container";
import NotificationBar from "./components/shared/NotificationBar";
import {
  SplashView,
  GuideList,
  LocationDetailsScreen,
  GuideDetailsScreen,
  WelcomeView,
  SubLocationsOnMapView,
  ObjectDetailsScreen,
  WebView,
  VideoView,
  ImageScreen,
  DownloadsScreen,
  SettingsScreen,
} from "./components/screens/";
import {
  Colors,
  TextStyles,
} from "./styles/";

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors.darkPurple,
  },
});

const tabNavigatorParams = {
  tabBarPosition: "bottom",
  swipeEnabled: false,
  animationEnabled: false,
  backBehavior: "none",
  lazy: true,
  tabBarOptions: {
    pressColor: Colors.darkPurple,
    showIcon: true,
    activeTintColor: Colors.purple,
    inactiveTintColor: Colors.warmGrey,
    activeBackgroundColor: Colors.white,
    inactiveBackgroundColor: Colors.white,
    labelStyle: TextStyles.tabBarLabel,
    style: {
      backgroundColor: Colors.white,
    },
    indicatorStyle: {
      backgroundColor: Colors.darkPurple,
    },
  },
};

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
    Home: { screen: GuideList },
    LocationDetailsScreen: { screen: LocationDetailsScreen },
    GuideDetailsScreen: { screen: GuideDetailsScreen },
    SubLocationsOnMapView: { screen: SubLocationsOnMapView },
    ObjectDetailsScreen: { screen: ObjectDetailsScreen },
    WebView: { screen: WebView },
    VideoView: { screen: VideoView },
    ImageScreen: { screen: ImageScreen },
  },
  headerStyle,
);

const DownloadNavigator = StackNavigator(
  {
    DownloadsScreen: { screen: DownloadsScreen },
  },
  headerStyle,
);

const SettingsNavigator = StackNavigator(
  {
    SettingsScreen: { screen: SettingsScreen },
  },
  headerStyle,
);

const TabBarNavigator = TabNavigator(
  {
    Home: { screen: GuideNavigator },
    DownloadsScreen: { screen: DownloadNavigator },
    Settings: { screen: SettingsNavigator },
  },
  tabNavigatorParams,
);

const RootNavigator = StackNavigator(
  {
    Splash: { screen: SplashView },
    WelcomeView: { screen: WelcomeView },
    GuideList: { screen: TabBarNavigator },
  },
  {
    headerMode: "none",
  },
);

const ios = Platform.OS === "ios";

// TODO this class should most likely be merged into App (index.js)
export default class Nav extends Component {
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
