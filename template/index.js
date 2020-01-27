import { AppRegistry } from "react-native";
import GuideApp from "guide-app/src/App";
import FullScreenVideoScreen from "guide-app/src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";

AppRegistry.registerComponent(AppName, () => GuideApp);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
