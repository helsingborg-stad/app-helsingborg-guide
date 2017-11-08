import React, { Component } from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import ViewContainer from "./components/shared/view_container";
import MenuContent from "./components/MenuContent";
import NotificationBar from "./components/shared/NotificationBar";
import {
  SplashView,
  GuideList,
  GuideView,
  SubLocationView,
  WelcomeView,
  SubLocationsOnMapView,
  ObjectView,
  WebView,
  VideoView,
  ImageView,
  DownloadManagerView,
} from "./components/screens/";

const GuideListNavigator = DrawerNavigator(
  {
    Home: { screen: GuideList },
  },
  {
    drawerPosition: "right",
    contentComponent: MenuContent,
  },
);

const GuideViewNavigator = DrawerNavigator(
  {
    GuideView: { screen: GuideView },
  },
  {
    drawerPosition: "right",
    contentComponent: MenuContent,
  },
);

const SubLocationViewNavigator = DrawerNavigator(
  {
    SubLocationView: { screen: SubLocationView },
  },
  {
    drawerPosition: "right",
    contentComponent: MenuContent,
  },
);

const RootNavigator = StackNavigator(
  {
    Splash: { screen: SplashView },
    WelcomeView: { screen: WelcomeView },
    GuideList: { screen: GuideListNavigator },
    GuideView: { screen: GuideViewNavigator },
    SubLocationView: { screen: SubLocationViewNavigator },
    SubLocationsOnMapView: { screen: SubLocationsOnMapView },
    ObjectView: { screen: ObjectView },
    WebView: { screen: WebView },
    VideoView: { screen: VideoView },
    ImageView: { screen: ImageView },
    DownloadManagerView: { screen: DownloadManagerView },
  },
  {
    headerMode: "none",
  },
);

// TODO this class should most likely be merged into App (index.js)
export default class Nav extends Component {
  static displayNotificationBar() {
    return <NotificationBar style={{ bottom: 0 }} />;
  }

  render() {
    return (
      <ViewContainer>
        <RootNavigator onNavigationStateChange={Nav.onNavigationStateChange} />
        {Nav.displayNotificationBar()}
      </ViewContainer>
    );
  }
}
