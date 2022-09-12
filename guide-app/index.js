import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import GuideApp from "./src/App";
// import useNotifications from "@hooks/useNotifications";
import FullScreenVideoScreen from "./src/components/screens/FullScreenVideoScreen";
import configureStore from "@src/store/configureStore";
import { name as AppName } from "./app.json";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistor } = configureStore();

function HeadlessCheck({ isHeadless }) {
  // const { setBackgroundNotificationHandler } = useNotifications();
  // setBackgroundNotificationHandler();

  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GuideApp />
      </PersistGate>
    </Provider>
  );
}

AppRegistry.registerComponent(AppName, () => HeadlessCheck);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
