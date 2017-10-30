import React, { Component } from "react";
import { StatusBar } from "react-native";
import { StackNavigator } from "react-navigation";
import SplashView from "../../scenes/SplashView";
import ViewContainer from "../../shared/view_container";
import MenuView from "../../shared/MenuView";
import MenuContent from "../../scenes/MenuContent";
import NotificationBar from "../../shared/NotificationBar";
import GuideList from "./../../scenes/GuideList";
import WelcomeView from "./../../scenes/WelcomeView";

const RootNavigator = StackNavigator(
  {
    Splash: { screen: SplashView },
    WelcomeView: { screen: WelcomeView },
    GuideList: { screen: GuideList },
  },
  {
    headerMode: "none",
  },
);

// TODO this class should most likely be merged into App (index.js)
export default class Nav extends Component {
  static onNavigationStateChange(prevState, newState) {
    console.log("onNavigationStateChanged", prevState, newState);
  }

  static displayNotificationBar() {
    return <NotificationBar style={{ bottom: 0 }} />;
  }

  displayMenu() {
    // TODO fix the menu ?
    return (<MenuView>{/*
        <MenuContent navigator={this.getNavigator.bind(this)} />
      */}</MenuView>);
  }

  render() {
    return (
      <ViewContainer>
        <RootNavigator onNavigationStateChange={Nav.onNavigationStateChange} />
        {this.displayMenu()}
        {Nav.displayNotificationBar()}
      </ViewContainer>
    );
  }
}
