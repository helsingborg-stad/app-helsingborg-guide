import React, { Component } from "react";
import { StyleSheet, Linking } from "react-native";
import WebView from "react-native-webview";
import PropTypes from "prop-types";
import { Colors } from "@assets/styles";
import HeaderBackButton from "@shared-components/HeaderBackButton";

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.themeSecondary
  }
});

export default class WebScreen extends Component {
  static navigationOptions = ({ navigation, route }) => {
    const { title } = route.params || {};
    return {
      title,
      headerLeft: () => <HeaderBackButton navigation={navigation} />,
      headerRight: () => null,
      headerStyle: styles.header,
    };
  };

  static propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
  };

  render() {
    const { url } = this.props.route.params || {};
    return (
      <WebView
        androidHardwareAccelerationDisabled
        ref={ref => {
          this.webView = ref;
        }}
        source={{ uri: url }}
        onNavigationStateChange={event => {
          if (event.url !== url) {
            this.webView.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}
