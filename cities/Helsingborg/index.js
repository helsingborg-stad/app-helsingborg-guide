import React from "react";
import { AppRegistry } from "react-native";
import { persistStore } from 'redux-persist'
import Orientation from "react-native-orientation-locker";
import Helsingborg from "guide-app/src/App";
import useNotifications from "@hooks/useNotifications";
import FullScreenVideoScreen from "guide-app/src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";
import store from "@src/store/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

let persistor = persistStore(store)

Orientation.lockToPortrait();

const { setBackgroundNotificationHandler } = useNotifications();

setBackgroundNotificationHandler();

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Helsingborg />
    </PersistGate>
  </Provider>;
}

AppRegistry.registerComponent(AppName, () => HeadlessCheck);

AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
