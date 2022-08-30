import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import ViewContainer from "@shared-components/view_container";
import { Colors } from "@assets/styles";

const styles = StyleSheet.create({
  splash: {
    backgroundColor: Colors.white
  },  wrapper: {
    flex: 1,
    zIndex: 10
  },
  loadingSpinner: {
    height: "100%",
    width: "100%"
  }
});


const LoadingScreen = () => {

  return (
    <ViewContainer style={styles.splash}>
      <View style={styles.wrapper}>
        <ActivityIndicator style={styles.loadingSpinner} />
      </View>
    </ViewContainer>
  );
};


export default LoadingScreen;



