// @flow

import React, { Component, type Node } from "react";
import { ScrollView, Text, Image, TouchableOpacity, View } from "react-native";
import styles from "./style";
import SharingService from "@services/SharingService";

const closeIcon = require("@assets/images/ic_close.png");

type TrailInformation = {
  title: ?string,
  description: ?string,
  image: ?Images
};

type Props = {
  trailInformation: TrailInformation,
  onPressFunction: () => void,
  downloadComponent: () => Node,
  disableShare: Boolean,
};

function renderTitle(trailInformation: TrailInformation) {
  if (trailInformation.title) {
    return <Text style={styles.titleText}>{trailInformation.title} </Text>;
  }
  return null;
}

function renderShareButton(
  trailInformation: TrailInformation,
  renderingComponent: Component<*>,
  disableShare: Boolean
) {
  if ((trailInformation.title && trailInformation.image, !disableShare)) {
    return (
      <View style={styles.shareContainer}>
        <SharingService
          title={trailInformation.title}
          image={trailInformation.image}
          sender={renderingComponent}
          shareType="share_guide"
        />
      </View>
    );
  }
  return null;
}

function renderScrollableContent(
  trailInformation: TrailInformation,
  renderingComponent: Component<*>,
  disableShare: Boolean,
) {
  const style = trailInformation.title
    ? styles.scrollView
    : styles.scrollViewNoTitle;

  return (
    <ScrollView style={style}>
      {renderTitle(trailInformation)}
      <Text style={styles.descriptionText}>{trailInformation.description}</Text>
      {renderShareButton(trailInformation, renderingComponent, disableShare)}
    </ScrollView>
  );
}

class MapInformationOverlay extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {renderScrollableContent(this.props.trailInformation, this, this.props?.disableShare)}
        <TouchableOpacity
          onPress={this.props.onPressFunction}
          style={styles.closeButtonContainer}
        >
          <Image style={styles.closeButton} source={closeIcon} />
        </TouchableOpacity>
        {this.props.downloadComponent ? this.props.downloadComponent() : null}
      </View>
    );
  }
}

export default MapInformationOverlay;
