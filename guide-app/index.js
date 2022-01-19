import { AppRegistry } from "react-native";
import GuideApp from "./src/App";
import useNotifications from "@hooks/useNotifications"
import FullScreenVideoScreen from "./src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";

const { setBackgroundNotificationHandler } = useNotifications()

setBackgroundNotificationHandler()

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <GuideApp />;
}
AppRegistry.registerComponent(AppName, () => HeadlessCheck);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
