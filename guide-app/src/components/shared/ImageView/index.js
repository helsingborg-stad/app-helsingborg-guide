// @flow

import React, { PureComponent } from "react";
import { Image } from "react-native";
import { loadFromCache, startDownload } from "@utils/DownloadMediaUtils";

const placeholderImage = require("@assets/images/no-image-featured-image.png");

type Props = {
  source: { uri?: ?string, sessionId?: number },
  style?: Object,
  resizeMode?: ResizeMode
};

type State = {
  imageSource: any
};

export default class ImageView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const source = props?.source;
    const uri = source?.uri;
    const sessionId = source?.sessionId;

    let imageSource = placeholderImage;

    console.log("uri", uri, "sessionId", sessionId);

    if (uri) {
      if (sessionId) {
        loadFromCache(`${sessionId}`, uri)
          .then(data => {
            // cache hit, download image
            data && this.setState({
              imageSource: { uri: `data:image/png;base64,${data}` }
            });
          })
          .catch((err) => {
            startDownload(sessionId)
            // cache miss, download image
            this.setState({ imageSource: { uri } });
          });
      } else {
        imageSource = { uri };
      }
    }
    this.state = { imageSource };
  }

  render() {
    const { style, resizeMode } = this.props;
    const { imageSource } = this.state;
    return <Image source={imageSource} style={style} resizeMode={resizeMode} />;
  }
}
