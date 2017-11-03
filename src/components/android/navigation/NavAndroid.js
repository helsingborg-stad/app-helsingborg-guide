import React, { Component } from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import SplashView from "../../scenes/SplashView";
import ViewContainer from "../../shared/view_container";
import NotificationBar from "../../shared/NotificationBar";
import GuideList from "./../../scenes/GuideList";
import GuideView from "./../../scenes/GuideView";
import SubLocationView from "./../../scenes/SubLocationView";
import WelcomeView from "./../../scenes/WelcomeView";
import SubLocationsOnMapView from "./../../scenes/SubLocationsOnMapView";
import ObjectView from "./../../scenes/ObjectView";
import WebView from "./../../scenes/WebScene";
import VideoView from "./../../scenes/VideoView";
import ImageView from "./../../scenes/ImageScene";
import MenuContent from "./../../scenes/MenuContent";

const GuideListNavigator = DrawerNavigator(
  {
    Home: { screen: GuideList },
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
    GuideView: { screen: GuideView },
    SubLocationView: { screen: SubLocationView },
    SubLocationsOnMapView: { screen: SubLocationsOnMapView },
    ObjectView: { screen: ObjectView },
    WebView: { screen: WebView },
    VideoView: { screen: VideoView },
    ImageView: { screen: ImageView },
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

  static displayMenu() {
    return <MenuView>{<MenuContent />}</MenuView>;
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
