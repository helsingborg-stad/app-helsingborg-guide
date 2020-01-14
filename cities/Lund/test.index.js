import React, { Component } from "react";
import { AppRegistry, View, ScrollView, Text } from "react-native";
// import * as Lund from "guide-app/src/App";
// import FullScreenVideoScreen from "guide-app/src/components/screens/FullScreenVideoScreen";
// import DebugScreen from "guide-app/src/components/screens/DebugScreen";
import Lund from "guide-app/src/components/shared/DebugView";
import { name as AppName } from "./app.json";

// console.log({ Lund, AppName });

// type Props = {
//   appVersion: ?string,
//   buildVersion: ?string,
//   bundleIdentifier: ?string
// };

// const styles = {};

// const DebugView = (props: Props) => (
//   <View style={styles.viewContainer}>
//     <ScrollView>
//       <Text>
//         {props.appVersion ? `App version:${props.appVersion}` : "App version:?"}
//       </Text>
//       <Text>
//         {props.buildVersion
//           ? `Build version:${props.buildVersion}`
//           : "Build version:?"}
//       </Text>
//       <Text>
//         {props.bundleIdentifier
//           ? `Bundle identifier:${props.bundleIdentifier}`
//           : "Bundle identifier?"}
//       </Text>
//     </ScrollView>
//   </View>
// );

AppRegistry.registerComponent(AppName, () => Lund);
// AppRegistry.registerComponent("VideoApp", () => FullScreenVideoScreen);
