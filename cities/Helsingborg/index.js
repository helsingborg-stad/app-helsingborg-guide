import { AppRegistry } from "react-native";
import Helsingborg from "guide-app/src/App";
import FullScreenVideoScreen from "guide-app/src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";

AppRegistry.registerComponent(AppName, () => Helsingborg);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
