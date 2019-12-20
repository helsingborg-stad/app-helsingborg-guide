import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppRegistry, Alert, UIManager, Platform, Linking } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Nav from "@src/Nav";
import configureStore from "@src/store/configureStore";
import internetChanged from "@actions/internetActions";
import LangService from "@services/langService";
import Opener from "@services/SettingsService";
import { errorHappened } from "@actions/errorActions";
import FullScreenVideoScreen from "@src/components/screens/FullScreenVideoScreen";
import LocationService from "@services/locationService";
import DownloadTasksManager from "@services/DownloadTasksManager";
import {
  appStarted,
  appBecameActive,
  appBecameInactive
} from "@actions/uiStateActions";
import { setLanguage } from "@actions/navigationActions";

import { name as AppName } from "./app.json";

const { store, persistor } = configureStore();

// TODO decouple these store reference hacks
LocationService.getInstance().store = store;
DownloadTasksManager.store = store;

function openInternetSettings() {
  if (Platform.OS === "android") {
    Opener.openWifiSetting();
  } else {
    Linking.openURL("app-settings:");
  }
}

function init() {
  LangService.loadStoredLanguage()
    .then(() => {
      // Check the network and load the content.
      store.dispatch(setLanguage(LangService.code));
      loadContents(LangService.code);
    })
    .catch(error => store.dispatch(errorHappened(error)));
}

function loadContents() {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      LangService.getLanguages();
    }
  });
}

function alert() {
  Alert.alert(
    LangService.strings.NO_INTERNET_CONNECTION,
    LangService.strings.NO_INTERNET_CONNECTION_MESSAGE,
    [
      {
        text: LangService.strings.SETTINGS,
        onPress: openInternetSettings
      },
      { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" }
    ],
    { cancelable: false }
  );
}

export default class Lund extends Component {
  constructor() {
    super();

    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    LocationService.getInstance()
      .subscribeGeoLocation()
      .catch(console.warn);
    LocationService.getInstance()
      .subscribeCompassBearing()
      .catch(console.warn);

    LangService.loadStoredLanguage();
    this.startListeningToNetworkChanges();
  }

  componentWillUnmount() {
    LocationService.getInstance().unsubscribeGeoLocation();
    LocationService.getInstance().unsubscribeCompassBearing();

    this.stopListeningToNetworkChanges();
  }

  startListeningToNetworkChanges() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  stopListeningToNetworkChanges() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange(isConnected) {
    if (!isConnected) {
      store.dispatch(internetChanged(false));
      this.noNetworkTimer = setTimeout(alert, 2500);
      return;
    }

    store.dispatch(internetChanged(true));

    if (this.noNetworkTimer) {
      clearTimeout(this.noNetworkTimer);
      this.noNetworkTimer = null;
    }

    init();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Nav
            onAppStarted={() => store.dispatch(appStarted())}
            onAppBecameActive={() => store.dispatch(appBecameActive())}
            onAppBecameInactive={() => store.dispatch(appBecameInactive())}
          />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(AppName, () => Lund);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
