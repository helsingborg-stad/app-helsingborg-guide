import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  AppRegistry,
  Alert,
  NetInfo,
  UIManager,
  Platform,
  Linking,
} from "react-native";
import Nav from "src/Nav";
import configureStore from "src/store/configureStore";
import internetChanged from "src/actions/internetActions";
import LangService from "src/services/langService";
import Opener from "src/services/SettingsService";
import { errorHappened } from "src/actions/errorActions";
import FullScreenVideoScreen from "src/components/screens/FullScreenVideoScreen";
import LocationService from "src/services/locationService";
import DownloadTasksManager from "src/services/DownloadTasksManager";
import { appStarted, appBecameActive, appBecameInactive } from "src/actions/uiStateActions";
import { setLanguage, fetchAvailableLanguages } from "src/actions/navigationActions";

const { store, persistor } = configureStore();

// TODO decouple these store reference hacks
LocationService.getInstance().store = store;
DownloadTasksManager.store = store;

export default class GuideHbg extends Component {
  static openInternetSettings() {
    if (Platform.OS === "android") {
      Opener.openWifiSetting();
    } else {
      Linking.openURL("app-settings:");
    }
  }

  static init() {
    LangService.loadStoredLanguage()
      .then(() => {
        // Check the network and load the content.
        store.dispatch(setLanguage(LangService.code));
        GuideHbg.loadContents(LangService.code);
      })
      .catch(error => store.dispatch(errorHappened(error)));
  }

  static loadContents() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        LangService.getLanguages();
      }
    });
  }

  static alert() {
    Alert.alert(
      LangService.strings.NO_INTERNET_CONNECTION,
      LangService.strings.NO_INTERNET_CONNECTION_MESSAGE,
      [
        {
          text: LangService.strings.SETTINGS,
          onPress: GuideHbg.openInternetSettings,
        },
        { text: LangService.strings.CLOSE, onPress: () => { }, style: "cancel" },
      ],
      { cancelable: false },
    );
  }

  constructor() {
    super();
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    store.dispatch(fetchAvailableLanguages());

    const locationService = LocationService.getInstance();
    locationService.watchGeoLocation().catch(() => {
      locationService.askForPermission().then((permission) => {
        if (permission === "granted") locationService.watchGeoLocation();
      });
    });

    LangService.loadStoredLanguage();
    this.startListeningToNetworkChanges();
  }

  componentWillUnmount() {
    this.stopListeningToNetworkChanges();
  }

  startListeningToNetworkChanges() {
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectivityChange);
  }

  stopListeningToNetworkChanges() {
    NetInfo.isConnected.removeEventListener("connectionChange", this.handleConnectivityChange);
  }

  handleConnectivityChange(isConnected) {
    if (!isConnected) {
      store.dispatch(internetChanged(false));
      this.noNetworkTimer = setTimeout(() => GuideHbg.alert(), 2500);
      return;
    }

    store.dispatch(internetChanged(true));

    if (this.noNetworkTimer) {
      clearTimeout(this.noNetworkTimer);
      this.noNetworkTimer = null;
    }

    GuideHbg.init();
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

AppRegistry.registerComponent("GuideHbg", () => GuideHbg);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
