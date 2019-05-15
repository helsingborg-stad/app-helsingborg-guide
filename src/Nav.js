// @flow
import React, { Component } from "react";
import {
  AppState,
  StatusBar,
  Platform,
} from "react-native";
import {
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import {
  DebugScreen,
  DownloadsScreen,
  GuideScreen,
  HomeScreen,
  ImageScreen,
  CategoryListScreen,
  CategoryMapScreen,
  LocationScreen,
  ObjectScreen,
  SearchObjectScreen,
  SettingsScreen,
  SplashScreen,
  TrailScreen,
  VideoScreen,
  WebScreen,
  WelcomeScreen,
} from "./components/screens";
import ViewContainer from "./components/shared/view_container";
import BottomBarView from "./components/shared/BottomBarView";
import {
  Colors,
  HeaderStyles,
} from "./styles/";
import AnalyticsUtils from "./utils/AnalyticsUtils";
import NavigatorService from "./services/navigationService";

const GuideNavigator = createStackNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    TrailScreen: { screen: TrailScreen },
    LocationScreen: { screen: LocationScreen },
    ObjectScreen: { screen: ObjectScreen },
    GuideDetailsScreen: { screen: GuideScreen },
    WebScreen: { screen: WebScreen },
    VideoScreen: { screen: VideoScreen },
    ImageScreen: { screen: ImageScreen },
    DownloadsScreen: { screen: DownloadsScreen },
    SettingsScreen: { screen: SettingsScreen },
    DebugScreen: { screen: DebugScreen },
    CategoryListScreen: { screen: CategoryListScreen },
    CategoryMapScreen: { screen: CategoryMapScreen },
  },
  { defaultNavigationOptions: HeaderStyles.default },
);

const RootNavigator = createStackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    WelcomeScreen: { screen: WelcomeScreen },
    MainScreen: { screen: GuideNavigator },
    SearchObjectScreen: { screen: SearchObjectScreen },
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
}

export default class Nav extends Component<Props> {
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
      AnalyticsUtils.setScreen(currentScreen);
    }
  }

  componentDidMount = () => {
    this.props.onAppStarted();
    AppState.addEventListener("change", this.onAppStateChange);
  }

  onAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      this.props.onAppBecameActive();
    } else if (nextAppState === "inactive") {
      this.props.onAppBecameInactive();
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
