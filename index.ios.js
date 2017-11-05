/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry, StyleSheet, AlertIOS, NetInfo, UIManager, AsyncStorage, Linking } from "react-native";
import { Provider } from "react-redux";
import { getStoredState } from "redux-persist";
import Nav from "./src/components/android/navigation/NavAndroid";
import store from "./src/store/configureStore";
import { loadGuides } from "./src/actions/guideActions";
import { loadSubLocations } from "./src/actions/subLoactionActions";
import { LangService } from "./src/services/langService";
import downloadManager from "./src/services/DownloadTasksManager";
import { internetChanged } from "./src/actions/internetActions";
import { errorHappened } from "./src/actions/errorActions";

export default class GuideHbg extends Component {
  noNetworkTimer;

  constructor() {
    super();
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

    this.init = this.init.bind(this);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    LangService.loadStoredLanguage();
    this.startListeningToNetworkChanges();
    this.loadExistingDownloads();
  }

  componentWillUnmount() {
    this.stopListeningToNetworkChanges();
  }

  init() {
    LangService.loadStoredLanguage()
      .then((loaded) => {
        // Check the network and load the content.
        this.loadContents(LangService.code);
      })
      .catch(error => store.dispatch(errorHappened(error)));
  }
  loadExistingDownloads() {
    getStoredState({ storage: AsyncStorage }, (err, state) => {
      if (!err && state && state.downloads && state.downloads.length) downloadManager.loadExistingTasks(state.downloads);
    });
  }
  alert() {
    AlertIOS.alert(LangService.strings.NO_INTERNET_CONNECTION, LangService.strings.NO_INTERNET_CONNECTION_MESSAGE, [
      { text: LangService.strings.SETTINGS, onPress: this.openInternetSettings.bind(this) },
      { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" },
    ]);
  }
  openInternetSettings() {
    Linking.openURL("app-settings:");
  }
  startListeningToNetworkChanges() {
    NetInfo.isConnected.addEventListener("change", this.handleConnectivityChange);
  }
  stopListeningToNetworkChanges() {
    NetInfo.isConnected.removeEventListener("change", this.handleConnectivityChange);
  }
  handleConnectivityChange(isConnected) {
    if (!isConnected) {
      store.dispatch(internetChanged(false));
      this.noNetworkTimer = setTimeout(() => this.alert(), 2500);
      return;
    }

    store.dispatch(internetChanged(true));

    if (this.noNetworkTimer) {
      clearTimeout(this.noNetworkTimer);
      this.noNetworkTimer = null;
    }

    this.init();
  }

  loadContents(langCode) {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        store.dispatch(loadGuides(langCode));
        store.dispatch(loadSubLocations(langCode));
        LangService.getLanguages().catch(error => console.log("error in getting lang"));
      }
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Nav reloadFunc={this.loadContents} />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

AppRegistry.registerComponent("GuideHbg", () => GuideHbg);
