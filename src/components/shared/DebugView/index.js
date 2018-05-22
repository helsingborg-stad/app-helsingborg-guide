// @flow

import React from "react";
import { View, ScrollView, Switch, Text } from "react-native";
import styles from "./style";

type Props = {
  appVersion: ?string,
  buildVersion: ?string,
  bundleIdentifier: ?string,
  showDrafts: boolean,
  onShowDraftsChange: (value: boolean) => (void)
}

const DebugView = (props: Props) => (
  <View style={styles.viewContainer} >
    <ScrollView>
      <Text>{props.appVersion ? `App version: ${props.appVersion}` : "App version:?"}</Text>
      <Text>{props.buildVersion ? `Build version: ${props.buildVersion}` : "Build version:?"}</Text>
      <Text>{props.bundleIdentifier ? `Bundle identifier: ${props.bundleIdentifier}` : "Bundle identifier?"}</Text>

      <Text>Show drafts
        <Switch value={props.showDrafts} onValueChange={props.onShowDraftsChange} />
      </Text>
    </ScrollView>
  </View>
);

export default DebugView;
