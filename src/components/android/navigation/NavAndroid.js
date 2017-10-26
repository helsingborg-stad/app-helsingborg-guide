import React, { Component } from "react";
import { View, Text, Navigator, StatusBar, BackAndroid } from "react-native";
import SplashView from "../../scenes/SplashView";
import ViewContainer from "../../shared/view_container";
import MenuView from "../../shared/MenuView";
import MenuContent from "../../scenes/MenuContent";
import NotificationBar from "../../shared/NotificationBar";
import GuideList from "../../scenes/GuideList";

// No need for this, just pass the View object instead.
const routes = [{ title: "Splash", component: SplashView }];

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    this.listenToBackBtn();
  }

  getNavigator() {
    return this.refs.navigator;
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.stopListenToBackBtn();
  }

  listenToBackBtn() {
    BackAndroid.addEventListener("hardwareBackPress", this.onBackButtonPressed);
  }
  stopListenToBackBtn() {
    BackAndroid.removeEventListener("hardwareBackPress", this.onBackButtonPressed);
  }

  onMainScreen() {
    const stackLength = this.refs.navigator.getCurrentRoutes().length;
    return stackLength == 1;
  }
  goBack() {
    this.refs.navigator.pop();
  }

  exitApp() {
    BackAndroid.exitApp();
  }

  onBackButtonPressed() {
    if (!this.onMainScreen()) {
      this.goBack();
      return true;
    }
    this.exitApp();
    return false;
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
    return (
      <MenuView>
        <MenuContent navigator={this.getNavigator.bind(this)} />
      </MenuView>
    );
  }

  displayNotificationBar() {
    return <NotificationBar style={{ bottom: 0 }} />;
  }

  render() {
    return (
      <ViewContainer>
        <Navigator
          ref="navigator"
          initialRoute={routes[0]}
          configureScene={this.configureScene}
          renderScene={this._renderScene}
          style={{ flex: 1, backgroundColor: "#f6f6f6" }}
        />
        {this.displayMenu()}
        {this.displayNotificationBar()}
      </ViewContainer>
    );
  }
}
