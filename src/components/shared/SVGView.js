import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import SvgUri from "react-native-svg-uri";

const placeholderImage = require("../../images/iconPointPropertyPlaceholder.svg");

export default class SVGView extends Component {
  static displaySVG(logoType, placeholder, customStyle) {
    const styleObj = StyleSheet.flatten(customStyle);
    const sourceImg = logoType ? { uri: logoType } : placeholderImage;

    return (
      <View style={customStyle}>
        <SvgUri
          width={styleObj.width}
          height={styleObj.height}
          // source={{ uri: logoType }}
          // source={placeholderImage}
          source={sourceImg}
        />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return SVGView.displaySVG(this.props.logoType, this.props.placeHolder, this.props.customStyle);
  }
}
