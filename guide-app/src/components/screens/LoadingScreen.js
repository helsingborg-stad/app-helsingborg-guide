import React, { useState, useEffect, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  LayoutAnimation, ActivityIndicator,
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
import { showBottomBar } from "@actions/uiStateActions";


const LOGO = require("@assets/images/logo.png");
const IMAGE = require("@assets/images/SplashscreenFinal.png");

const FULL_HEIGHT = Dimensions.get("window").height;

const TIME_OUT = 1000;
const LONG_TIME_OUT = 7000;


const styles = StyleSheet.create({
  splash: {
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    zIndex: 10,
  },
  loadingSpinner: {
    height: "100%",
    width: "100%",
  },
});


const LoadingScreen = (props) => {
  const { params } = props?.navigation?.state;
  const dispatch = useDispatch();

  const appName = LangService.strings.APP_NAME;

  useEffect(() => {

    console.log("params", params)

  }, [params]);





  return (
    <ViewContainer style={styles.splash}>

      <View style={styles.wrapper}>
        <ActivityIndicator style={styles.loadingSpinner} />
      </View>
    </ViewContainer>
  );
};

LoadingScreen["navigationOptions"] = screenProps => ({
  headerShown: false,
});

export default LoadingScreen;



