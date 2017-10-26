import React, { Component } from "react";
import { StatusBar, BackHandler } from "react-native";
import { StackNavigator } from "react-navigation";
import SplashView from "../../scenes/SplashView";
import ViewContainer from "../../shared/view_container";
import MenuView from "../../shared/MenuView";
import MenuContent from "../../scenes/MenuContent";
import NotificationBar from "../../shared/NotificationBar";

// No need for this, just pass the View object instead.
const routes = [{ title: "Splash", component: SplashView }];

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    this.listenToBackBtn();
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
