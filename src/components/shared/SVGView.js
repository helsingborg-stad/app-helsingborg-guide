import React, { Component } from "react";
import { View, Text } from "react-native";
import SvgUri from "react-native-svg-uri";

export default class SVGView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  displaySVG(logoType, placeholder, customStyle) {
    if (!logoType) return <Text>{placeholder}</Text>;

    return (
      <View style={customStyle}>
        <SvgUri
          width="30"
          height="30"
          source={{ uri: logoType }}
        />
      </View>
    );
  }

  render() {
    return this.displaySVG(this.props.logoType, this.props.placeHolder, this.props.customStyle);
  }
}
