// @flow

import React from "react";
import { Image } from "react-native";

const placeholderImage = require("../../../images/no-image-featured-image.png");

function getImage(uri: ?string, style?: Object, resizeMode?: ResizeMode) {
  let imageSource;
  if (!uri) { imageSource = placeholderImage; } else { imageSource = { uri }; }

  return (
    <Image source={imageSource} style={style} resizeMode={resizeMode} />
  );
}

type Props = {
  source: Object,
  style?: Object,
  resizeMode?: ResizeMode
}

export default function ImageView(props: Props) {
  return getImage(props.source.uri, props.style, props.resizeMode);
}
