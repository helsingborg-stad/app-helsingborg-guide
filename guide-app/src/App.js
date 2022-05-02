import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/integration/react";
import { Alert, UIManager, Platform, Linking, LogBox } from "react-native";
import { Host } from "react-native-portalize";
import NetInfo from "@react-native-community/netinfo";
import Nav from "@src/Nav";
import store from "@src/store/configureStore";
import internetChanged from "@actions/internetActions";
import LangService from "@services/langService";
import Opener from "@services/SettingsService";
import { errorHappened } from "@actions/errorActions";
import LocationService from "@services/locationService";
import DownloadTasksManager from "@services/DownloadTasksManager";
import {
  appStarted,
  appBecameActive,
  appBecameInactive
} from "@actions/uiStateActions";
import { setLanguage } from "@actions/navigationActions";
import TrackingPermission from "@shared-components/TrackingPermission";
import useNotifications from "@hooks/useNotifications";



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

function alert() {
  Alert.alert(
    LangService.strings.NO_INTERNET_CONNECTION,
    LangService.strings.NO_INTERNET_CONNECTION_MESSAGE,
    [
      {
        text: LangService.strings.SETTINGS,
        onPress: openInternetSettings
      },
      {
        text: LangService.strings.CLOSE,
        onPress: () => {
        },
        style: "cancel"
      }
    ],
    { cancelable: false }
  );
}

const GuideApp = () => {
  const [netInfo, setNetInfo] = useState();
  const { subscribeToNotifications, onNotification } = useNotifications();
  const state = useSelector(s => s);


  function init() {

  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state.isConnected);
      store.dispatch(internetChanged(true));
      if (this?.noNetworkTimer) {
        clearTimeout(this.noNetworkTimer);
        this.noNetworkTimer = null;
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (netInfo) {
      LangService.loadStoredLanguage()
        .then((res) => {
          store.dispatch(setLanguage(LangService.code || "sv"));
        })
        .catch((error) => store.dispatch(errorHappened(error)));
      LangService.getLanguages();
    } else {
      store.dispatch(internetChanged(false));
      // this.noNetworkTimer = setTimeout(alert, 2500);
      return;
    }
  }, [netInfo]);


  useEffect(() => {
    // TEMPORARY SOLUTIONS
    LogBox.ignoreLogs([
      "Warning: componentWillMount has been renamed, and is not recommended for use.",
      "Warning: componentWillReceiveProps has been renamed, and is not recommended for use.",
      "Warning: componentWillUpdate has been renamed, and is not recommended for use.",
      "Remote debugger is in a background tab which may cause apps to perform slowly",
      "Require cycle: ../../node_modules/rn-fetch-blob/index.js",
      "Require cycle: ../../node_modules/react-native/Libraries/Network/fetch.js",
      "new NativeEventEmitter",
      "new NativeEventEmitter() was called with a non-null argument",
      "new NativeEventEmitter() was called with a non-null argument without the required removeListeners method.",
      "new NativeEventEmitter() was called with a non-null argument without the required removeListeners method.",
      "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.",
      "`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method."
    ]);
    subscribeToNotifications();
    onNotification();
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    const locationService = LocationService.getInstance();
    locationService.getGeoLocation().catch(console.warn);
    locationService.subscribeGeoLocation().catch(console.warn);
  }, []);

  return (
    <SafeAreaProvider>
      <Host>
          <TrackingPermission />
          <Nav
            onAppStarted={() => store.dispatch(appStarted())}
            onAppBecameActive={() => store.dispatch(appBecameActive())}
            onAppBecameInactive={() => store.dispatch(appBecameInactive())}
          />
      </Host>
    </SafeAreaProvider>
  );
};

export default GuideApp;

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
