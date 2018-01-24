import React, { Component } from "react";
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";

const FULL_WIDTH = Dimensions.get("window").width;
const FULL_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  spinner: {
    flex: 3,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default class BackgroundImage extends Component {
  static propTypes = {
    source: PropTypes.number.isRequired,
    style: PropTypes.object,
    blurRadius: PropTypes.number,
  }

  static defaultProps = {
    style: {},
    blurRadius: 0,
  }

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

  displaySpinner() {
    if (this.state.loading) return <ActivityIndicator style={[styles.spinner]} />;
    return null;
  }

  displayImage() {
    const { source } = this.props;

    const imageSize = {
      width: FULL_WIDTH,
      height: FULL_HEIGHT,
    };
    return (
      <View>
        <Image
          style={[styles.image, imageSize]}
          source={source}
          blurRadius={this.props.blurRadius}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          resizeMethod="scale"
          resizeMode="cover"
        />
        {this.displaySpinner()}
      </View>
    );
  }

  render() {
    return <View style={[styles.imageContainer, this.props.style]}>{this.displayImage()}</View>;
  }
}
