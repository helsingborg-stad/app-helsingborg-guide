import React from "react";
import { WebView, StyleSheet, Linking } from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../../styles/";

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.darkPurple,
  },
});

const WebScreen = (props) => {
  const { url } = props.navigation.state.params;

  return (
    <WebView
      ref={(ref) => {
        this.webView = ref;
      }}
      source={{ uri: url }}
      onNavigationStateChange={(event) => {
        if (event.url !== url) {
          this.webView.stopLoading();
          Linking.openURL(event.url);
        }
      }}
    />
  );
};

WebScreen.navigationOptions = {
  headerRight: null,
  headerStyle: styles.header,
};

WebScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WebScreen;
