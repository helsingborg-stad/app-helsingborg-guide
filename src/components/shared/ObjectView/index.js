// @flow

import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./style";

type Props = {
  contentObject: ContentObject
}

function displayText(description?: string) {
  return (
    <View style={styles.articleContainer}>
      <Text style={styles.article}>{description}</Text>
    </View>
  );
}

const ObjectView = (props: Props) => (
  <View style={styles.viewContainer}>
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.bodyContainer}>
        {/* this.displayTitle() */}
        {/* this.displayButtonsBar() */}
        {props.contentObject.description ? displayText(props.contentObject.description) : null}
        {/* <View style={styles.articleContainer}>{this.displayLinks()}</View> */}
      </View>
    </ScrollView>
  </View>

);

ObjectView.defaultProps = {
};

export default ObjectView;
