// @flow

import React, { Component } from "react";
import { Image, Platform } from "react-native";
import { loadFromCache } from "../../../utils/DownloadMediaUtils";

const placeholderImage = require("../../../images/no-image-featured-image.png");

type Props = {
  source: { uri?: ?string, sessionId?: number },
  style?: Object,
  resizeMode?: ResizeMode,
}

type State = {
  imageSource: any,
};

export default class ImageView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log("ImageView.constructor()", props);

    const { source } = props;
    const { uri, sessionId } = source;

    let imageSource;
    if (!uri) {
      imageSource = placeholderImage;
    } else {
      imageSource = { uri };
      if (sessionId) {
        loadFromCache(`${sessionId}`, uri)
          .then((data) => {
            console.log("CACHE hit. great success!!");
            this.setState({ imageSource: { uri: `data:image/png;base64,${data}` } });
          })
          .catch(error => console.log("CACHE miss. DISSAPOINTED: ", error));
      }
    }

    this.state = { imageSource };
  }

  render() {
    const { style, resizeMode } = this.props;
    const { imageSource } = this.state;
    return (
      <Image source={imageSource} style={style} resizeMode={resizeMode} />
    );
  }
}
