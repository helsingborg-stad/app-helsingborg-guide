/**
 * Created by msaeed on 2017-02-04.
 */
/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Dimensions, Image, LayoutAnimation, AsyncStorage, NetInfo, Alert } from "react-native";
import ViewContainer from "../shared/view_container";
import GuideList from "./GuideList";
import WelcomeView from "./WelcomeView";
import { IS_WELCOMED } from "../../lib/my_consts";
import ColoredBar from "../shared/ColoredBar";
import BackgroundImage from "../shared/BackgroundImage";

const HALS_LOGO = require("../../images/HBG.png");
const IMAGE = require("../../images/SplashscreenFinal.png");

const FULL_HEIGHT = Dimensions.get("window").height;

const TIME_OUT = 2000;

export default class SplashView extends Component {
  timer;
  colorsTimer;

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

  componentWillReceiveProps(nextProps, nextContext) {
    console.log("splash will receive new props");
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (this.colorsTimer) clearInterval(this.colorsTimer);
  }

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
    const welcomeRoute = {
      title: "Welcome",
      type: "fade",
      component: WelcomeView,
    };
    const mainRoute = {
      title: "GuidesList",
      type: "fade",
      component: GuideList,
    };
    AsyncStorage.getItem(IS_WELCOMED).then((value) => {
      let welcomed = false;
      if (value) welcomed = JSON.parse(value);

      const route = welcomed ? mainRoute : welcomeRoute;
      this.props.navigator.resetTo(route);
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

const styles = StyleSheet.create({
  splash: {
    backgroundColor: "#7B075E",
  },
  wrapper: {
    flex: 1,
    zIndex: 10,
  },
  mainContainer: {
    flex: 10,
    // backgroundColor:'#7B075E',
    alignItems: "center",
    // justifyContent:'center',
  },
  headerContainer: {
    // flex:1,
    height: Dimensions.get("window").height * 0.35,
    // backgroundColor:'red',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  headerText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 36,
    minHeight: 50,
  },
  logoContainer: {
    flex: 1,
    // backgroundColor:'blue',
    justifyContent: "flex-end",
    paddingVertical: 22,
    zIndex: 10,
  },
  logo: { width: 62, height: 66 },
});
