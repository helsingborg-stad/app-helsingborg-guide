// @flow

import React from "react";
import { StyleSheet } from "react-native";
import SVGImage from "react-native-remote-svg";

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
    <SVGImage
      source={sourceImg}
      style={styleObj}
    />
  );
}
