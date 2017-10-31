import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import SplashView from "../../scenes/SplashView";
import ViewContainer from "../../shared/view_container";
import NotificationBar from "../../shared/NotificationBar";
import GuideList from "./../../scenes/GuideList";
import GuideView from "./../../scenes/GuideView";
import WelcomeView from "./../../scenes/WelcomeView";

const RootNavigator = StackNavigator(
  {
    Splash: { screen: SplashView },
    WelcomeView: { screen: WelcomeView },
    GuideList: { screen: GuideList },
    GuideView: { screen: GuideView }
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

  // TODO Configure side menu in every screen that needs it, i.e. as navigationOptions
  /*
  displayMenu() {
    return <MenuView>{<MenuContent navigator={this.getNavigator.bind(this)} />}</MenuView>;
  }
  */

  render() {
    return (
      <ViewContainer>
        <RootNavigator onNavigationStateChange={Nav.onNavigationStateChange} />
        {Nav.displayNotificationBar()}
      </ViewContainer>
    );
  }
}
