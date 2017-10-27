import React, { Component } from "react";
// TODO remove BackHandler functionality for now
import { StatusBar, BackHandler } from "react-native";
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

export default class Nav extends Component {
  static onNavigationStateChange(prevState, newState) {
    console.log("onNavigationStateChanged", prevState, newState);
  }

  static displayNotificationBar() {
    return <NotificationBar style={{ bottom: 0 }} />;
  }

  constructor(props) {
    super(props);

    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    // this.listenToBackBtn();
  }

  componentWillUnmount() {
    this.stopListenToBackBtn();
  }

  onMainScreen() {
    const stackLength = this.refs.navigator.getCurrentRoutes().length;
    return stackLength == 1;
  }

  onBackButtonPressed() {
    if (!this.onMainScreen()) {
      this.goBack();
      return true;
    }
    BackHandler.exitApp();
    return false;
  }

  listenToBackBtn() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressed);
  }

  stopListenToBackBtn() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackButtonPressed);
  }

  goBack() {
    this.refs.navigator.pop();
  }

  _renderScene(route, navigator) {
    const scene = <route.component navigator={navigator} {...route.passProps} />;

    return (
      <ViewContainer>
        <StatusBar backgroundColor="white" hidden barStyle="dark-content" />
        {scene}
      </ViewContainer>
    );
  }

  configureScene(route, routeStack) {
    if (route.type == "modal") return Navigator.SceneConfigs.FloatFromBottom;
    if (route.type == "fade") return Navigator.SceneConfigs.FadeAndroid;
    return Navigator.SceneConfigs.PushFromRight;
  }

  displayMenu() {
    return (<MenuView>{/*
        <MenuContent navigator={this.getNavigator.bind(this)} />
      */}</MenuView>);
  }

  render() {
    return (
      <ViewContainer>
        <RootNavigator onNavigationStateChange={Nav.onNavigationStateChange} />

        {/*
        <Navigator
          ref="navigator"
          initialRoute={routes[0]}
          configureScene={this.configureScene}
          renderScene={this._renderScene}
          style={{ flex: 1, backgroundColor: "#f6f6f6" }}
        />
      */}
        {this.displayMenu()}
        {Nav.displayNotificationBar()}
      </ViewContainer>
    );
  }
}
