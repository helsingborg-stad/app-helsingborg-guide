// @flow

import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./style";

type Props = {
  contentObject: ContentObject,
  guideType: GuideType
}

function displayID(searchableID: string) {
  const idText = (
    <View style={styles.idContainer}>
      <Text style={styles.idText}>
        {`ID #${searchableID}`}
      </Text>
    </View>
  );
  return idText;
}

function displayTitle(title: string, searchableID: string, guideType: GuideType) {
  return (
    <View>
      <View style={styles.titleContainer} >
        <Text style={styles.title}>{title}</Text>
      </View >
      {guideType === "guide" ? displayID(searchableID) : null}
    </View >
  );
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
        {displayTitle(props.contentObject.title, props.contentObject.searchableId, props.guideType)}
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
