import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UIManager } from "react-native";
import { Host } from "react-native-portalize";
import NetInfo from "@react-native-community/netinfo";
import Nav from "@src/Nav";
import store from "@src/store/configureStore";
import internetChanged from "@actions/internetActions";
import LangService from "@services/langService";
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
import useNotifications from "@hooks/useNotifications";
import { ignoreNonImportant } from "@utils/WarningUtils";

// TODO decouple these store reference hacks
LocationService.getInstance().store = store;
DownloadTasksManager.store = store;

const GuideApp = () => {
  const [netInfo, setNetInfo] = useState();
  const { subscribeToNotifications, onNotification } = useNotifications();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
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
        .then(() => {
          store.dispatch(setLanguage(LangService.code || "sv"));
        })
        .catch((error) => store.dispatch(errorHappened(error)));
      LangService.getLanguages();
    } else {
      store.dispatch(internetChanged(false));
    }
  }, [netInfo]);

  useEffect(() => {
    ignoreNonImportant();
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
