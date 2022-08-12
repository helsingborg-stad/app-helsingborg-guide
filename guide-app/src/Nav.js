// @flow
import React, { useEffect, useState, useRef } from "react";
import { AppState, StatusBar, Platform, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Orientation from "react-native-orientation-locker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native";
import { navigationRef } from "@utils/NavigationUtils";
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
  ARIntroductionScreen,
} from "@src/components/screens";
import { selectOpenedLink } from "@actions/uiStateActions";
import CalendarDetailsScreen from "@src/components/screens/CalendarDetailsScreen";
import ScanScreen from "@src/components/screens/ScanScreen";
import NotFoundScreen from "@src/components/screens/NotFoundScreen";
import ViewContainer from "@shared-components/view_container";
import BottomBarView from "@shared-components/BottomBarView";
import { Colors, HeaderStyles } from "@assets/styles";
import useInitialURL from "@hooks/useUniversalLinks";
import { initializeTracker } from "@utils/MatomoUtils";
import { setShowFilterButton } from "@actions/uiStateActions";

const Stack = createStackNavigator();

const prefix = "guidehbg://";

const config = {
  screens: {
    HomeScreen: "home/:type?/:id_1?/:id_2?/:id_3?",
    CalendarScreen: "calendar/:id",
    WelcomeScreen: "",
    MainScreen: "",
    SearchObjectScreen: "",
    ARIntroductionScreen: ""
  }
};

const linking = {
  prefixes: ["guidehbg://"],
  config
};

const RootStack = () => (
  <Stack.Navigator screenOptions={{
    ...HeaderStyles.default,
  }}>
    <Stack.Screen
      name={"HomeScreen"}
      component={HomeScreen}
      options={{
        header: () => null,
      }}
    />
    <Stack.Screen name={"CalendarScreen"} component={CalendarScreen} />
    <Stack.Screen name={"TrailScreen"} component={TrailScreen} />
    <Stack.Screen
      name={"LocationScreen"}
      component={LocationScreen}

    />
    <Stack.Screen name={"ObjectScreen"} component={ObjectScreen} />
    <Stack.Screen name={"QuizScreen"} component={QuizScreen} />
    <Stack.Screen name={"QuizResultScreen"} component={QuizResultScreen} />
    <Stack.Screen
      name={"GuideDetailsScreen"}
      component={GuideScreen}
      options={() => ({
        headerMode: "screen"
      })}
    />
    <Stack.Screen name={"WebScreen"} component={WebScreen} />
    <Stack.Screen name={"VideoScreen"} component={VideoScreen} />
    <Stack.Screen
      name={"ImageScreen"}
      component={ImageScreen}
      options={() => ({
        headerMode: "none",
        headerTitle: "",
        title: ""
      })}
    />
    <Stack.Screen name={"DownloadsScreen"} component={DownloadsScreen} />
    <Stack.Screen name={"SettingsScreen"} component={SettingsScreen} />
    <Stack.Screen name={"ScanScreen"} component={ScanScreen} />
    <Stack.Screen name={"DebugScreen"} component={DebugScreen} />
    <Stack.Screen name={"CategoryMapScreen"} component={CategoryMapScreen} />
    <Stack.Screen
      name={"CalendarDetailsScreen"}
      component={CalendarDetailsScreen}
    />
    <Stack.Screen
      name={"NotFoundScreen"}
      component={NotFoundScreen}
      options={() => ({
        headerMode: "none",
        headerTitle: "Not Found",
        title: "Not Found",
        header: () => null
      })}
    />
    <Stack.Screen name={"SplashScreen"} component={SplashScreen} />
    <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
    <Stack.Screen name={"SearchObjectScreen"} component={SearchObjectScreen} />
    <Stack.Screen name={"ARIntroductionScreen"} component={ARIntroductionScreen} />
  </Stack.Navigator>
);


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
  const { showFilterButton } = useSelector((s) => s.uiState);
  const [homeLoaded, setHomeLoaded] = useState(false);
  const { url } = useInitialURL();
  const routeNameRef = useRef();


  useEffect(() => {
    Orientation.lockToPortrait();
    onAppStarted();
    initializeTracker();
    AppState.addEventListener("change", onAppStateChange);
  }, []);

  useEffect(() => {
    if (url && homeLoaded) {
      if (url?.includes(UNIVERSAL_LINKING_URL)) {
        console.log("URL lol", url);

        let params =
          url.split(UNIVERSAL_LINKING_URL + "/?page=")[1] ||
          url.split(UNIVERSAL_LINKING_URL + "?page=")[1];
        if (params) {
          let finalUrl = prefix + "home/" + params;
          dispatch(selectOpenedLink(url));
          Linking.openURL(finalUrl);
        }
      }
    }
  }, [url, homeLoaded]);

  const onNavigationStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute().name;
    if (previousRouteName !== currentRouteName) {
      console.log("CURRENT SCREEN", currentRouteName);
      if (currentRouteName === "HomeScreen") {
        !showFilterButton && dispatch(setShowFilterButton(true));
        !homeLoaded && setHomeLoaded(true);
      } else {
        showFilterButton && dispatch(setShowFilterButton(false));
      }
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
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}
        onStateChange={onNavigationStateChange}
        linking={linking}
      >
        <RootStack />
      </NavigationContainer>
      <BottomBarView />
    </ViewContainer>
  );
};

Nav.getCurrentRouteName = (navigationState: Object) => {
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
