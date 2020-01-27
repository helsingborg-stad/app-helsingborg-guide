import { AppRegistry } from "react-native";
import GuideApp from "./src/App";
import FullScreenVideoScreen from "./src/components/screens/FullScreenVideoScreen";
import { name as AppName } from "./app.json";

AppRegistry.registerComponent(AppName, () => GuideApp);
AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
