// @flow

import React, { Component, type Node } from "react";
import { ScrollView, Text, Image, TouchableOpacity, View } from "react-native";
import styles from "./style";

const closeIcon = require("@assets/images/ic_close.png");

type Information = {
  title: ?string,
  description: ?string,
  image: ?Images,
  additional: ?string,
};

type Props = {
  information: Information,
  onPressFunction: () => void,
  downloadComponent: () => Node,
};

function renderTitle(information: Information) {
  if (information.title) {
    return <Text style={styles.titleText}>{information.title} </Text>;
  }
  return null;
}

function renderScrollableContent(
  information: Information
) {
  const style = information.title
    ? styles.scrollView
    : styles.scrollViewNoTitle;

  return (
    <View style={style}>
      {renderTitle(information)}
      <Text style={styles.descriptionText}>{information.description}</Text>
      <Text style={styles.descriptionText}>{information.additional}</Text>
      {information?.image ? <View style={styles.image}>
        {information.image}
      </View> : null}
    </View>
  );
}

class InformationOverlay extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {renderScrollableContent(this.props.information, this)}
        <TouchableOpacity
          onPress={this.props.onPressFunction}
          style={styles.closeButtonContainer}
        >
          <Image style={styles.closeButton} source={closeIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default InformationOverlay;
