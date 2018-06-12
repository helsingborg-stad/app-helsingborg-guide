// @flow

import React, { Component, type Node } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, TextStyles } from "../../styles/";
import { StyleSheetUtils } from "../../utils/";
import SharingService from "../../services/SharingService";

const closeIcon = require("../../images/ic_close.png");

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const defaultMargin = 17;
const closeButtonSize = 26;
const scrollViewMaxHeight = screenHeight - 138; // magic number here, but roughly (listitem + header + margins)

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: screenWidth - defaultMargin * 2,
    margin: defaultMargin,
    backgroundColor: Colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  scrollView: {
    maxHeight: scrollViewMaxHeight,
  },
  scrollViewNoTitle: {
    maxHeight: scrollViewMaxHeight,
    width: "90%",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButton: {
    width: closeButtonSize,
    height: closeButtonSize,
    backgroundColor: Colors.white,
    borderRadius: closeButtonSize / 2,
  },
  titleText: StyleSheetUtils.flatten([
    TextStyles.title,
    {
      color: Colors.black,
      fontSize: 24,
      lineHeight: 36,
      marginTop: 22,
      marginHorizontal: defaultMargin,
    },
  ]),
  descriptionText: StyleSheetUtils.flatten([
    TextStyles.description,
    {
      margin: defaultMargin,
      color: Colors.greyBodyText,
      lineHeight: 22,
    },
  ]),
  shareContainer: {
    paddingLeft: defaultMargin,
    paddingRight: defaultMargin,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

type TrailInformation = {
  title: ?string,
  description: ?string,
  image: ?Images
};

type Props = {
  trailInformation: TrailInformation,
  onPressFunction: () => void,
  downloadComponent: () => Node
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
) {
  if (trailInformation.title && trailInformation.image) {
    return (
      <View style={styles.shareContainer}>
        {SharingService.showShareButton(
          trailInformation.title,
          trailInformation.image,
          renderingComponent,
        )}
      </View>
    );
  }
  return null;
}

function renderScrollableContent(
  trailInformation: TrailInformation,
  renderingComponent: Component<*>,
) {
  const style = trailInformation.title
    ? styles.scrollView
    : styles.scrollViewNoTitle;

  return (
    <ScrollView style={style}>
      {renderTitle(trailInformation)}
      <Text style={styles.descriptionText}>{trailInformation.description}</Text>
      {renderShareButton(trailInformation, renderingComponent)}
    </ScrollView>
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class MapInformationOverlay extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {renderScrollableContent(this.props.trailInformation, this)}
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
