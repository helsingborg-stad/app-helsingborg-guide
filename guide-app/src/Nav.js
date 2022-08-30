// @flow
import React, { useEffect, useState, useRef } from "react";
import { AppState, StatusBar, Platform, Linking, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Orientation from "react-native-orientation-locker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import HeaderFiller from "@shared-components/HeaderFiller";
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
  SettingsScreen,
  SplashScreen,
  TrailScreen,
  VideoScreen,
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
import LangService from "./services/langService";
import { backgroundColor } from "react-native-calendars/src/style";

const Stack = createNativeStackNavigator();

const prefix = "guidehbg://";

const config = {
  screens: {
    HomeScreen: "home/:type?/:id_1?/:id_2?/:id_3?",
    CalendarScreen: "calendar/:id",
  },
};

const linking = {
  prefixes: ["guidehbg://"],
  config,
};

const RootStack = () => (
  <Stack.Navigator
    screenOptions={{
      ...HeaderStyles.default,
    }}
  >
    <Stack.Screen
      name={"SplashScreen"}
      component={SplashScreen}
      options={{ headerShown: false, header: () => null }}
    />
    <Stack.Screen
      name={"HomeScreen"}
      component={HomeScreen}
      options={{
        header: () => null,
        ...HeaderStyles.noElevation,
      }}
    />
    <Stack.Screen
      name={"CalendarScreen"}
      component={CalendarScreen}
      options={{ header: () => null }}
    />
    <Stack.Screen
      name={"TrailScreen"}
      component={TrailScreen}
      options={({ navigation, route }) => {
        const { title, path } = route?.params || {};
        return {
          title,
          headerLeft: () => (
            <HeaderBackButton navigation={navigation} path={path} />
          ),
        };
      }}
    />
    <Stack.Screen
      name={"LocationScreen"}
      component={LocationScreen}
      options={({ navigation, route }) => {
        const { title, path } = route.params || {};
        return {
          title: title || LangService.strings.LOCATION,
          headerRight: () => <HeaderFiller />,
          headerLeft: () => (
            <HeaderBackButton navigation={navigation} path={path} />
          ),
        };
      }}
    />

    <Stack.Screen
      name={"ObjectScreen"}
      component={ObjectScreen}
      options={({ navigation, route }) => {
        const { title, path, scrollable, panToIndex, redirect, array, order } =
          route.params || {};
        return {
          ...HeaderStyles.noElevation,
          title: title,
          headerLeft: () => (
            <HeaderBackButton
              navigation={navigation}
              path={path}
              onPress={() => {
                if (scrollable && panToIndex && redirect === array[order].id) {
                  scrollable(order);
                  panToIndex(order);
                }
              }}
            />
          ),
          headerRight: () => <HeaderFiller />,
        };
      }}
    />
    <Stack.Screen
      name={"QuizScreen"}
      component={QuizScreen}
      options={({ navigation, route }) => {
        const { quiz } = route.params || {};
        return {
          ...HeaderStyles.noElevation,
          title: quiz.title,
          headerRight: () => <HeaderFiller />,
          headerLeft: () => (
            <HeaderBackButton
              navigation={navigation}
              onPress={() => null}
              displayBottomBar={true}
            />
          ),
        };
      }}
    />
    <Stack.Screen
      name={"QuizResultScreen"}
      component={QuizResultScreen}
      options={{
        headerShown: false,
        header: () => null,
      }}
    />
    <Stack.Screen
      name={"GuideDetailsScreen"}
      component={GuideScreen}
      options={({ navigation, route }) => {
        const { path, title } = route?.params || {};
        return {
          headerMode: "screen",
          title,
          headerRight: () => <HeaderFiller />,
          headerLeft: () => (
            <HeaderBackButton navigation={navigation} path={path} />
          ),
        };
      }}
    />
    <Stack.Screen
      name={"VideoScreen"}
      component={VideoScreen}
      options={({ navigation, route }) => {
        const { title } = route.params || {};
        return {
          title,
          headerLeft: () => <HeaderBackButton navigation={navigation} />,
          headerRight: () => <View style={{ width: 36 }} />,
          headerStyle: { backgroundColor: "black" },
          tabBarVisible: false,
        };
      }}
    />
    <Stack.Screen
      name={"ImageScreen"}
      component={ImageScreen}
      options={({ navigation }) => {
        return {
          headerMode: "none",
          title: "",
          headerLeft: () => <HeaderBackButton navigation={navigation} />,
          headerRight: () => null,
          headerStyle: { backgroundColor: "black" },
        };
      }}
    />
    <Stack.Screen
      name={"DownloadsScreen"}
      component={DownloadsScreen}
      options={({ navigation, route }) => {
        const { path } = route?.params || {};
        return {
          title: LangService.strings.DOWNLOADS,
          headerLeft: () => (
            <HeaderBackButton navigation={navigation} path={path} />
          ),
          headerRight: () => <HeaderFiller />,
        };
      }}
    />
    <Stack.Screen
      name={"SettingsScreen"}
      component={SettingsScreen}
      options={{
        title: LangService.strings.SETTINGS,
        headerLeft: () => null,
      }}
    />
    <Stack.Screen
      name={"ScanScreen"}
      component={ScanScreen}
      options={{
        title: LangService.strings.SCAN,
        headerLeft: () => <HeaderFiller />,
        headerRight: () => <HeaderFiller />,
      }}
    />
    <Stack.Screen name={"DebugScreen"} component={DebugScreen} />
    <Stack.Screen
      name={"CategoryMapScreen"}
      component={CategoryMapScreen}
      options={({ navigation, route }) => {
        const { title } = route?.params || {};
        return {
          title,
          headerRight: () => <View />,
          headerLeft: () => <HeaderBackButton navigation={navigation} />,
        };
      }}
    />
    <Stack.Screen
      name={"CalendarDetailsScreen"}
      component={CalendarDetailsScreen}
      options={({ navigation, route }) => {
        const { event, path } = route.params || {};
        return {
          title: event?.name || "Event",
          headerLeft: () => (
            <HeaderBackButton navigation={navigation} path={path} />
          ),
          headerRight: () => <HeaderFiller />,
        };
      }}
    />
    <Stack.Screen
      name={"NotFoundScreen"}
      component={NotFoundScreen}
      options={{
        headerMode: "none",
        headerTitle: "Not Found",
        title: "Not Found",
        header: () => null,
      }}
    />
    <Stack.Screen
      name={"WelcomeScreen"}
      component={WelcomeScreen}
      options={{ headerShown: false, header: () => null }}
    />
    <Stack.Screen
      name={"ARIntroductionScreen"}
      component={ARIntroductionScreen}
    />
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

  const onNavigationStateChange = async () => {
    const currentRouteName = navigationRef.getCurrentRoute().name;
    console.log("CURRENT SCREEN", currentRouteName);
    if (currentRouteName === "HomeScreen") {
      !showFilterButton && dispatch(setShowFilterButton(true));
      !homeLoaded && setHomeLoaded(true);
    } else {
      showFilterButton && dispatch(setShowFilterButton(false));
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
