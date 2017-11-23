import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Image, LayoutAnimation, AsyncStorage } from "react-native";
import { NavigationActions } from "react-navigation";
import ViewContainer from "../shared/view_container";
import { IS_WELCOMED } from "../../lib/my_consts";
import ColoredBar from "../shared/ColoredBar";
import BackgroundImage from "../shared/BackgroundImage";
import {
  Colors,
} from "../../styles/";

const HALS_LOGO = require("../../images/HBG.png");
const IMAGE = require("../../images/SplashscreenFinal.png");

const FULL_HEIGHT = Dimensions.get("window").height;

const TIME_OUT = 2000;

const styles = StyleSheet.create({
  splash: {
    backgroundColor: Colors.darkPurple,
  },
  wrapper: {
    flex: 1,
    zIndex: 10,
  },
  mainContainer: {
    flex: 10,
    alignItems: "center",
  },
  headerContainer: {
    height: Dimensions.get("window").height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  headerText: {
    color: Colors.white,
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 36,
    minHeight: 50,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: 22,
    zIndex: 10,
  },
  logo: {
    width: 62,
    height: 66,
  },
});

export default class SplashView extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      barsVisible: true,
    };
  }

  componentDidMount() {
    this.colorsTimer = setInterval(() => this.fadeColors(), 500);
    this.startPageTimeout();
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (this.colorsTimer) clearInterval(this.colorsTimer);
  }

  timer;
  colorsTimer;

  startPageTimeout() {
    this.timer = setTimeout(() => {
      this.skip();
    }, TIME_OUT);
  }

  fadeColors() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ barsVisible: !this.state.barsVisible });
  }

  skip() {
    AsyncStorage.getItem(IS_WELCOMED).then((value) => {
      let welcomed = false;
      if (value) welcomed = JSON.parse(value);

      const route = welcomed ? "GuideList" : "WelcomeView";
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
      });
      this.props.navigation.dispatch(resetAction);
    });
  }

  displayColorBar() {
    return (
      <View style={{ position: "absolute", zIndex: 100, height: FULL_HEIGHT, width: 20, top: 0, left: 0 }}>
        <ColoredBar visible={this.state.barsVisible} />
      </View>
    );
  }

  render() {
    return (
      <ViewContainer style={styles.splash}>
        {this.displayColorBar()}
        <View style={styles.wrapper}>
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Guide</Text>
              <Text style={styles.headerText}>Helsingborg</Text>
            </View>
            <View style={styles.logoContainer}>
              <Image resizeMethod="scale" resizeMode="center" source={HALS_LOGO} />
            </View>
          </View>
        </View>
        <BackgroundImage source={IMAGE} />
      </ViewContainer>
    );
  }
}
