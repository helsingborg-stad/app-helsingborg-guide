import React from "react";
import { AppRegistry } from "react-native";
import Helsingborg from "guide-app/src/App";
import useNotifications from "@hooks/useNotifications";
import FullScreenVideoScreen from "guide-app/src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";
import configureStore from "@src/store/configureStore";
import { Provider } from "react-redux";

const { store } = configureStore();

const { setBackgroundNotificationHandler } = useNotifications();
setBackgroundNotificationHandler();

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <Provider store={store}>
    <Helsingborg />
  </Provider>;
}

AppRegistry.registerComponent(AppName, () => HeadlessCheck);

AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
