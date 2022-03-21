// @flow
import React, { Component, useEffect, useState } from "react";
import { AppState, StatusBar, Platform, View, Linking, Alert } from "react-native";
import { useDispatch } from "react-redux";
import Orientation from "react-native-orientation-locker";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { UNIVERSAL_LINKING_URL } from "@data/endpoints";


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
  ARIntroductionScreen
} from "@src/components/screens";
import { selectOpenedLink } from "@actions/uiStateActions";
import CalendarDetailsScreen from "@src/components/screens/CalendarDetailsScreen";
import ScanScreen from "@src/components/screens/ScanScreen";
import NotFoundScreen from "@src/components/screens/NotFoundScreen";
import ViewContainer from "@shared-components/view_container";
import BottomBarView from "@shared-components/BottomBarView";
import { Colors, HeaderStyles } from "@assets/styles";
import useInitialURL from "@hooks/useUniversalLinks";
import NavigatorService from "@services/navigationService";
import { initializeTracker } from "@utils/MatomoUtils";
import { useSelector } from "react-redux";

const prefix = "guidehbg://";

const GuideNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      path: "home/:type?/:id_1?/:id_2?/:id_3?",
      navigationOptions: {
        headerMode: "screen",
        headerTitle: "Guide Helsingborg",
        header: () => null
      }
    },

    CalendarScreen: {
      screen: CalendarScreen,
      path: "calendar/:id"
    },

    TrailScreen: { screen: TrailScreen },
    LocationScreen: {
      screen: LocationScreen,
      navigationOptions: {
        headerMode: "screen"
      }
    },
    ObjectScreen: {
      screen: ObjectScreen,
      navigationOptions: {}
    },
    QuizScreen: { screen: QuizScreen },
    QuizResultScreen: { screen: QuizResultScreen },
    GuideDetailsScreen: {
      screen: GuideScreen,
      navigationOptions: {
        headerMode: "screen"
      }
    },
    WebScreen: { screen: WebScreen },
    VideoScreen: { screen: VideoScreen },
    ImageScreen: {
      screen: ImageScreen,
      navigationOptions: {
        headerMode: "none",
        title: ""
      }
    },
    DownloadsScreen: { screen: DownloadsScreen },
    SettingsScreen: { screen: SettingsScreen },
    ScanScreen: { screen: ScanScreen },
    DebugScreen: { screen: DebugScreen },
    CategoryMapScreen: { screen: CategoryMapScreen },
    CalendarDetailsScreen: { screen: CalendarDetailsScreen },
    NotFoundScreen: {
      screen: NotFoundScreen,
      navigationOptions: {
        headerTitle: "Not Found",
        headerMode: "none",
        header: () => null,
      }},
  },
  { defaultNavigationOptions: HeaderStyles.default }
);

const RootNavigator = createStackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    WelcomeScreen: { screen: WelcomeScreen, path: "" },
    MainScreen: { screen: GuideNavigator, path: "" },
    SearchObjectScreen: { screen: SearchObjectScreen, path: "" },
    ARIntroductionScreen: { screen: ARIntroductionScreen, path: "" },
  },
  {
    headerMode: "none",
    mode: "modal"
  }
);

const NavigatorWrapper = createAppContainer(RootNavigator);

const ios = Platform.OS === "ios";

type AppStateStatus = "inactive" | "active" | "background";

type Props = {
  onAppStarted(): void,
  onAppBecameActive(): void,
  onAppBecameInactive(): void,
};


const Nav = (props: Props) => {

  const { onAppStarted, onAppBecameActive, onAppBecameInactive } = props;
  const dispatch = useDispatch();
  const [homeLoaded, setHomeLoaded] = useState(false);
  const { url } = useInitialURL();

  useEffect(() => {
    Orientation.lockToPortrait();
    onAppStarted();
    initializeTracker();
    AppState.addEventListener("change", onAppStateChange);
  }, []);


  useEffect(() => {
    if (url && homeLoaded) {
      if (url?.includes(UNIVERSAL_LINKING_URL)) {
        let type = url?.split("/").includes("guide") ? "guide" : "group";
        let path = url?.split(url?.includes("guide") ? "guide" : "group")[1];
        let finalUrl = prefix + "home/" + type + path;
        dispatch(selectOpenedLink(url))
        Linking.openURL(finalUrl);
      }
    }
  }, [url, homeLoaded]);


  const onNavigationStateChange = (prevState: Object, currentState: Object) => {
    const currentScreen = Nav.getCurrentRouteName(currentState);
    const prevScreen = Nav.getCurrentRouteName(prevState);
    if (prevScreen !== currentScreen) {
      !homeLoaded && currentScreen.routeName === "HomeScreen" && setHomeLoaded(true);
    }
  };

  const onAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      onAppBecameActive();
    } else if (nextAppState === "inactive") {
      onAppBecameInactive();
    }
  };
  return (
    <ViewContainer>
      <StatusBar
        translucent={ios}
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      {/* $FlowFixMe should be fixed in later flow versions */}
      <NavigatorWrapper
        onNavigationStateChange={onNavigationStateChange}
        ref={(navigatorRef) => {
          NavigatorService.setContainer(navigatorRef);
        }}
        uriPrefix={prefix}
      />
      <BottomBarView />
    </ViewContainer>
  );
};


Nav["getCurrentRouteName"] = (navigationState: Object) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return Nav.getCurrentRouteName(route);
  }
  return route;
};


export default Nav;
