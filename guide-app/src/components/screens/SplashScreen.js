import React, { useState, useEffect, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  LayoutAnimation,
} from "react-native";
import RNRestart from "react-native-restart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import ViewContainer from "@shared-components/view_container";
import { IS_WELCOMED } from "@src/lib/my_consts";
import ColoredBar from "@shared-components/ColoredBar";
import BackgroundImage from "@shared-components/BackgroundImage";
import { Colors } from "@assets/styles";
import LangService from "@services/langService";
import { connect, useSelector, useDispatch } from "react-redux";
import { compareDistance } from "@utils/SortingUtils";
import { fetchNavigation } from "../../actions/navigationActions";
import { fetchGuides } from "@actions/guideActions";
import { fetchGuideGroups } from "@actions/guideGroupActions";
import useGuides from "@hooks/useGuides";
import { setLanguage } from "@actions/navigationActions";


const LOGO = require("@assets/images/logo.png");
const IMAGE = require("@assets/images/SplashscreenFinal.png");

const FULL_HEIGHT = Dimensions.get("window").height;

const TIME_OUT = 1000;
const LONG_TIME_OUT = 7000;


const styles = StyleSheet.create({
  splash: {
    backgroundColor: Colors.themeSecondary,
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
  colorBarStyle: {
    position: "absolute",
    zIndex: 100,
    height: FULL_HEIGHT,
    width: 20,
    top: 0,
    left: 0,
  },
});


const SplashScreen = (props) => {
  const [barsVisible, setBarsVisible] = useState(true);
  const { getGuides } = useGuides();
  const state = useSelector(s => s);
  const dispatch = useDispatch();
  const { navigation, guideGroups, guides } = useSelector(s => s);
  const { navigationCategories, currentLanguage } = navigation;
  let timer;
  let longTimer;
  let colorsTimer;
  const appName = LangService.strings.APP_NAME;


  console.log("guides?? :9", guides.doneFetching)
  console.log("guides groups :9", guideGroups.doneFetching)

  useEffect(() => {
    dispatch(fetchNavigation(LangService.code || "sv"));
    LangService.setLanguage(LangService.code);
    dispatch(setLanguage(LangService.code));
    props.navigation.setParams();
    
    colorsTimer = setInterval(() => fadeColors(), 500);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (colorsTimer) {
        clearInterval(colorsTimer);
      }
      if (longTimer) {
        clearInterval(longTimer);
      }
    };
  }, []);


  // useEffect(() => {
  //   console.log(guides.items.length, guideGroups.items.length, LangService.code)
  //   if((guides.items.length || guideGroups.items.length) && props.navigation.isFocused() ) {
  //     timer = setTimeout(() => {
  //       skip();
  //     }, TIME_OUT)
  //   }
  // },[state])

  useEffect(() => {
        skip();
  }, []);


  //
  // useEffect(() => {
  //   skip();
  //    if(guideGroups?.items?.length) {
  //      if (longTimer) {
  //        clearInterval(longTimer);
  //      }
  //      timer = setTimeout(() => {
  //        skip();
  //      }, TIME_OUT)
  //    } else {
  //      longTimer = setTimeout(() => {
  //        props.navigation.isFocused() && !guideGroups?.items?.length && RNRestart.Restart()
  //      }, LONG_TIME_OUT)
  //    }
  // },[navigation, guideGroups])


  const fadeColors = () => {
    LayoutAnimation.easeInEaseOut();
    setBarsVisible(!barsVisible);
  };

  const skip = () => {
    AsyncStorage.getItem(IS_WELCOMED).then(value => {
      let welcomed = false;
      if (value) {
        welcomed = JSON.parse(value);
      }
      const route = welcomed ? "MainScreen" : "WelcomeScreen";
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
      });
      props.navigation.dispatch(resetAction);
    });
  };

  const displayColorBar = () => {
    return (
      <View style={styles.colorBarStyle}>
        <ColoredBar visible={barsVisible} />
      </View>
    );
  };

  return (
    <ViewContainer style={styles.splash}>
      {displayColorBar()}
      <View style={styles.wrapper}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {appName ? appName.split(" ")[0] : ""}
            </Text>
            <Text style={styles.headerText}>
              {appName ? appName.split(" ")[1] : ""}
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <Image resizeMethod="scale" resizeMode="center" source={LOGO} />
          </View>
        </View>
      </View>
      <BackgroundImage source={IMAGE} />
    </ViewContainer>
  );
};

SplashScreen["navigationOptions"] = screenProps => ({
  headerShown: false,
});

export default SplashScreen;



