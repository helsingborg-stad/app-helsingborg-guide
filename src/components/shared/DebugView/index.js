// @flow

import React from "react";
import { View, ScrollView, Text } from "react-native";
import styles from "./style";

type Props = {

}

const DebugView = (props: Props) => (
  <View style={styles.viewContainer} >
    <ScrollView style={styles.scrollView}>
      <Text>DebugView</Text>
    </ScrollView>
  </View>
);


export default DebugView;
