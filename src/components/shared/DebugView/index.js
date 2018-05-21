// @flow

import React from "react";
import { View, ScrollView, Text } from "react-native";
import styles from "./style";

type Props = {
  version: string
}

const DebugView = (props: Props) => (
  <View style={styles.viewContainer} >
    <ScrollView>
      <Text>{props.version}</Text>
    </ScrollView>
  </View>
);

export default DebugView;
