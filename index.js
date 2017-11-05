import React, { Component } from "react";
import { Provider } from "react-redux";
import { getStoredState } from "redux-persist";
import { AppRegistry, Alert, NetInfo, UIManager, AsyncStorage } from "react-native";
import Nav from "./src/components/android/navigation/NavAndroid";
import store from "./src/store/configureStore";
import { loadGuides } from "./src/actions/guideActions";
import { loadSubLocations } from "./src/actions/subLoactionActions";
import { internetChanged } from "./src/actions/internetActions";
import { LangService } from "./src/services/langService";
import Opener from "./src/services/SettingsService";
import { errorHappened } from "./src/actions/errorActions";
import downloadManager from "./src/services/DownloadTasksManager";

// TODO merge index.ios.js into this one
export default class GuideHbg extends Component {
  static openInternetSettings() {
    Opener.openWifiSetting();
  }

  static init() {
    LangService.loadStoredLanguage()
      .then(() => {
        // Check the network and load the content.
        GuideHbg.loadContents(LangService.code);
      })
      .catch(error => store.dispatch(errorHappened(error)));
  }

  static loadContents(langCode) {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        store.dispatch(loadGuides(langCode));
        store.dispatch(loadSubLocations(langCode));
        LangService.getLanguages().catch(() => console.log("error in getting lang"));
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
        { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" },
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

    console.ignoredYellowBox = ["Remote debugger"];
  }

  componentDidMount() {
    LangService.loadStoredLanguage();
    this.startListeningToNetworkChanges();
    this.loadExistingDownloads();
  }

  componentWillUnmount() {
    this.stopListeningToNetworkChanges();
  }

  // ####################################################
  // method on app load-
  loadExistingDownloads() {
    getStoredState({ storage: AsyncStorage }, (err, state) => {
      if (state && state.downloads && state.downloads.length) {
        downloadManager.loadExistingTasks(state.downloads);
      }
    });
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
        <Nav />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("GuideHbg", () => GuideHbg);
