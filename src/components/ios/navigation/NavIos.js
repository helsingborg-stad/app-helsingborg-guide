import React, { Component } from "react";
import { View, Text, NavigatorIOS } from "react-native";
import SplashView from "../../scenes/SplashView";
import AttractionList from "../../scenes/GuideList";

export default class Nav extends Component {
  render() {
    return (
      <NavigatorIOS
        ref={this.navigator}
        initialRoute={{ title: "Splash", component: SplashView, passProps: { navigator: this.navigator } }}
        style={{ flex: 1 }}
      />
    );
  }
}
