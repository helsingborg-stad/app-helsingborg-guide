import React, { Component } from "react";
import { WebView, StyleSheet, Linking } from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../../styles/";

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.darkPurple,
  },
});

export default class WebScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
      headerRight: null,
      headerStyle: styles.header,
    };
  };

  render() {
    const { url } = this.props.navigation.state.params;
    return (<WebView
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
    />);
  }
}
