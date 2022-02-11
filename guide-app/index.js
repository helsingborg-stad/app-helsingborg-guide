import { AppRegistry } from "react-native";
import Orientation from "react-native-orientation-locker";
import GuideApp from "./src/App";
import useNotifications from "@hooks/useNotifications"
import FullScreenVideoScreen from "./src/components/screens/FullScreenVideoScreen";
import configureStore from "@src/store/configureStore";
import { name as AppName } from "./app.json";
import { Provider } from "react-redux";


const { store } = configureStore();

const { setBackgroundNotificationHandler } = useNotifications()

setBackgroundNotificationHandler()

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <Provider store={store}><GuideApp /></Provider>
}
AppRegistry.registerComponent(AppName, () => HeadlessCheck);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
