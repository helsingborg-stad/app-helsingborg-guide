import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/integration/react";
import { Alert, UIManager, Platform, Linking } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Nav from "@src/Nav";
import configureStore from "@src/store/configureStore";
import internetChanged from "@actions/internetActions";
import LangService from "@services/langService";
import Opener from "@services/SettingsService";
import { errorHappened } from "@actions/errorActions";
import LocationService from "@services/locationService";
import DownloadTasksManager from "@services/DownloadTasksManager";
import {
  appStarted,
  appBecameActive,
  appBecameInactive,
} from "@actions/uiStateActions";
import { setLanguage } from "@actions/navigationActions";
import TrackingPermission from "@shared-components/TrackingPermission";

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
        onPress: openInternetSettings,
      },
      {
        text: LangService.strings.CLOSE, onPress: () => {
        }, style: "cancel",
      },
    ],
    { cancelable: false },
  );
}


export const GuideApp = () => {

  const [netInfo, setNetInfo] = useState();

  useEffect(() => {
    NetInfo.fetch().then(state => {
      let currentNetwork = state.isConnected;
      setNetInfo(currentNetwork);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state.isConnected);
      if (!state.isConnected) {
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
    });
    return unsubscribe;

  }, []);

  useEffect(() => {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    const locationService = LocationService.getInstance();
    locationService.getGeoLocation().catch(console.warn);
    locationService.subscribeGeoLocation().catch(console.warn);
    LangService.loadStoredLanguage();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <TrackingPermission />
          <Nav
            onAppStarted={() => store.dispatch(appStarted())}
            onAppBecameActive={() => store.dispatch(appBecameActive())}
            onAppBecameInactive={() => store.dispatch(appBecameInactive())}
          />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};


//
//
// export default class GuideApp extends Component {
//   constructor() {
//     super();
//
//     if (UIManager.setLayoutAnimationEnabledExperimental) {
//       UIManager.setLayoutAnimationEnabledExperimental(true);
//     }
//
//     this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
//   }
//
//   componentDidMount() {
//     const locationService = LocationService.getInstance();
//     locationService.getGeoLocation().catch(console.warn);
//     locationService.subscribeGeoLocation().catch(console.warn);
//     LangService.loadStoredLanguage();
//     this.startListeningToNetworkChanges();
//   }
//
//   componentWillUnmount() {
//     LocationService.getInstance().unsubscribeGeoLocation();
//     this.stopListeningToNetworkChanges();
//   }
//
//   startListeningToNetworkChanges() {
//     NetInfo.addEventListener(this.handleConnectivityChange);
//   }
//
//   stopListeningToNetworkChanges() {
//     NetInfo.removeEventListener(this.handleConnectivityChange);
//   }
//
//   handleConnectivityChange(state) {
//     if (!state.isConnected) {
//       store.dispatch(internetChanged(false));
//       this.noNetworkTimer = setTimeout(alert, 2500);
//       return;
//     }
//     store.dispatch(internetChanged(true));
//
//     if (this.noNetworkTimer) {
//       clearTimeout(this.noNetworkTimer);
//       this.noNetworkTimer = null;
//     }
//     init();
//   }
//
//   render() {
//     return (
//       <SafeAreaProvider>
//         <Provider store={store}>
//           <PersistGate persistor={persistor}>
//             <TrackingPermission />
//             <Nav
//               onAppStarted={() => store.dispatch(appStarted())}
//               onAppBecameActive={() => store.dispatch(appBecameActive())}
//               onAppBecameInactive={() => store.dispatch(appBecameInactive())}
//             />
//           </PersistGate>
//         </Provider>
//       </SafeAreaProvider>
//     );
//   }
// }
