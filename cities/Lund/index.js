import { AppRegistry } from "react-native";
import Lund from "guide-app/src/App";
import FullScreenVideoScreen from "guide-app/src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";

AppRegistry.registerComponent(AppName, () => Lund);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
