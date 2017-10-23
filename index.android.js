/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import Nav from './src/components/android/navigation/NavAndroid';
import store from './src/store/configureStore';
import { Provider } from 'react-redux';
import { loadGuides } from './src/actions/guideActions';
import { loadSubLocations } from './src/actions/subLoactionActions';
import { internetChanged } from './src/actions/internetActions';
import { AppRegistry, Alert, StyleSheet, NetInfo, UIManager, AsyncStorage } from 'react-native';
import { LangService } from './src/services/langService';
import Opener from './src/services/SettingsService';
import { errorHappened } from './src/actions/errorActions';
import { getStoredState } from 'redux-persist';
import { DownloadTasksManager } from './src/services/DownloadTasksManager';

export default class GuideHbg extends Component {
  noNetworkTimer;
  downloadManager;

  constructor() {
    super();
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);

    this.init = this.init.bind(this);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);

    this.downloadManager = DownloadTasksManager.getInstance();

    console.ignoredYellowBox = ['Debug Console'];
  }

  componentDidMount() {
    //this.init();
    LangService.loadStoredLanguage();
    this.startListeningToNetworkChanges();
    this.loadExistingDownloads();
  }

  componentWillUnmount() {
    console.log('app will unmounted');
    this.stopListeningToNetworkChanges();
  }

  init() {
    LangService.loadStoredLanguage()
      .then(loaded => {
        //Check the network and load the content.
        this.loadContents(LangService.code);
      })
      .catch(error => store.dispatch(errorHappened(error)));
  }

  //####################################################
  // method on app load-
  loadExistingDownloads() {
    getStoredState({ storage: AsyncStorage }, (err, state) => {
      if (state && state.downloads && state.downloads.length)
        this.downloadManager.loadExistingTasks(state.downloads);
    });
  }
  //########################################################

  alert() {
    console.log('I will alert##################');
    Alert.alert(
      LangService.strings.NO_INTERNET_CONNECTION,
      LangService.strings.NO_INTERNET_CONNECTION_MESSAGE,
      [
        { text: LangService.strings.SETTINGS, onPress: this.openInternetSettings.bind(this) },
        { text: LangService.strings.CLOSE, onPress: () => {}, style: 'cancel' },
      ],
      { cancelable: false },
    );
  }

  openInternetSettings() {
    Opener.openWifiSetting();
  }

  startListeningToNetworkChanges() {
    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange);
  }
  stopListeningToNetworkChanges() {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange);
  }
  handleConnectivityChange(isConnected) {
    if (!isConnected) {
      store.dispatch(internetChanged(false));
      this.noNetworkTimer = setTimeout(() => this.alert(), 2500);
      return;
    }
    console.log('There is connection');
    store.dispatch(internetChanged(true));

    if (this.noNetworkTimer) {
      clearTimeout(this.noNetworkTimer);
      this.noNetworkTimer = null;
    }

    this.init();
  }

  loadContents(langCode) {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        store.dispatch(loadGuides(langCode));
        store.dispatch(loadSubLocations(langCode));
        LangService.getLanguages().catch(error => console.log('error in getting lang'));
      }
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Nav />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('GuideHbg', () => GuideHbg);
