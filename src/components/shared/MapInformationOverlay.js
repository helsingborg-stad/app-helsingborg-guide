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
const scrollViewMaxHeight = screenHeight - 410; // magic number here, but roughly (listitem + header + margins)

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
      fontSize: 30,
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
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  shareBtn: {
    width: "30%",
  },
});

type Props = {
  trailInformation: { title: string, description: ?string, image: Images },
  onPressFunction: () => void,
  downloadComponent: () => Node
};

function renderTitle(trailInformation) {
  if (trailInformation.title) {
    return <Text style={styles.titleText}>{trailInformation.title} </Text>;
  }
  return null;
}

function renderDescription(trailInformation) {
  if (trailInformation.description) {
    return (
      <ScrollView style={styles.scrollView}>
        <Text style={styles.descriptionText}>
          {trailInformation.description}
        </Text>
      </ScrollView>
    );
  }
  return (
    <ScrollView style={styles.scrollViewNoTitle}>
      <Text style={styles.descriptionText}>{trailInformation.description}</Text>
    </ScrollView>
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class MapInformationOverlay extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flexing}>
          {renderTitle(this.props.trailInformation)}
          <TouchableOpacity
            onPress={this.props.onPressFunction}
            style={styles.closeButtonContainer}
          >
            <Image style={styles.closeButton} source={closeIcon} />
          </TouchableOpacity>
          {renderDescription(this.props.trailInformation)}
        </View>
        <View style={styles.shareContainer}>
          <View style={styles.shareBtn}>
            {SharingService.showShareButton(
              this.props.trailInformation.title,
              this.props.trailInformation.image,
              this,
            )}
          </View>
        </View>
        <View style={styles.downloadContainer}>
          {this.props.downloadComponent ? this.props.downloadComponent() : null}
        </View>
      </View>
    );
  }
}

export default MapInformationOverlay;
