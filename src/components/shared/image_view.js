import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import OImage from "./image";

const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.65;

const styles = StyleSheet.create({
  imageContainer: {},
  image: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: { flex: 1, width: 100, height: 100 },
});

export default class ImageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.onLoadStart = this.onLoadStart.bind(this);
    this.onLoadEnd = this.onLoadEnd.bind(this);
  }

  onLoadStart() {
    this.setState({ loading: true });
  }
  onLoadEnd() {
    this.setState({ loading: false });
  }

  _getOptWidth(width) {
    return width * (Dimensions.get("window").width / width);
  }

  _getOptHeight(height) {
    return height * (Dimensions.get("window").height / height);
  }

  displaySpinner() {
    if (this.state.loading) return <ActivityIndicator style={[styles.spinner]} />;
  }

  displayImage() {
    // If no source image is defined, use placeholder image
    let uri = this.props.source;
    const { guideID } = this.props;
    if (!uri || !uri.uri) uri = require("../../images/no-image-featured-image.png");

    // Using full screen width and a 16:9 aspect ratio
    displayWidth = Dimensions.get("window").width;
    displayHeight = (displayWidth / 16) * 9;

    // If height and/or width is defined, use that instead
    if (this.props.width) { displayWidth = this._getOptWidth(this.props.width); }
    if (this.props.height) { displayHeight = this._getOptHeight(this.props.height); }

    return (
      <OImage
        style={[
          {
            width: displayWidth,
            height: displayHeight,
            maxHeight: MAX_IMAGE_HEIGHT,
            zIndex: 1000,
          },
          styles.image,
        ]}
        source={uri}
        blurRadius={this.props.blur}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
        guideID={guideID}
      >
        {this.displaySpinner()}
        {this.props.children}
      </OImage>
    );
  }

  render() {
    return <View style={styles.imageContainer}>{this.displayImage()}</View>;
  }
}
