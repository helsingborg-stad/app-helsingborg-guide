import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SvgUri from "react-native-svg-uri";


export default class SVGView extends Component {
  static displaySVG(logoType, placeholder, customStyle) {
    if (!logoType) return <Text>{placeholder}</Text>;

    const styleObj = StyleSheet.flatten(customStyle);

    return (
      <View style={customStyle}>
        <SvgUri
          width={styleObj.width}
          height={styleObj.height}
          source={{ uri: logoType }}
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
