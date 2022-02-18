import React, { useState, useEffect, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import ViewContainer from "@shared-components/view_container";
import { Colors } from "@assets/styles";
import LangService from "@services/langService";
import { useSelector, useDispatch } from "react-redux";

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
  const { navigation } = useSelector(s => s);
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



