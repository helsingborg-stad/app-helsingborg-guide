// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import SvgUri from "react-native-svg-uri";

type Props = {
  logoType: ?string,
  placeholderImage: ?number,
  customStyle: any
}

export default function SVGView(props: Props) {
  const styleObj = StyleSheet.flatten(props.customStyle);

  if ((!props.logoType && !props.placeholderImage) || !styleObj) {
    return null;
  }

  const sourceImg = props.logoType ? { uri: props.logoType } : props.placeholderImage;

  return (
    <View style={styleObj}>
      <SvgUri
        width={styleObj.width}
        height={styleObj.height}
        source={sourceImg}
      />
    </View>
  );
}
