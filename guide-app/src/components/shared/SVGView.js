// @flow

import React from "react";
import { StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";

type Props = {
  logoType: ?string,
  placeholderImage: ?string,
  customStyle: any
};

export default function SVGView(props: Props) {
  const styleObj = StyleSheet.flatten(props.customStyle);

  if ((!props.logoType && !props.placeholderImage) || !styleObj) {
    return null;
  }
  const sourceImg = props.logoType
    ? { uri: props.logoType }
    : props.placeholderImage;

  return <SvgUri
    width={styleObj?.width}
    height={styleObj?.height}
    uri={sourceImg?.uri} />

}


