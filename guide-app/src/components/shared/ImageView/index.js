// @flow

import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { loadFromCache, startDownload } from "@utils/DownloadMediaUtils";

const placeholderImage = require("@assets/images/no-image-featured-image.png");

type Props = {
  source: { uri?: ?string, sessionId?: number },
  style?: Object,
  resizeMode?: ResizeMode,
};

const ImageView = (props: Props) => {
  const { style, resizeMode } = props;
  const source = props?.source;
  const uri = source?.uri;
  const sessionId = source?.sessionId;
  const [imageSource, setImageSource] = useState(placeholderImage);

  useEffect(() => {
    if (uri) {
      if (sessionId) {
        loadFromCache(`${sessionId}`, uri)
          .then((data) => {
            // cache hit, download image
            data && setImageSource({ uri: `data:image/png;base64,${data}` });
          })
          .catch(() => {
            startDownload(sessionId);
            // cache miss, download image
            setImageSource({ uri });
          });
      } else {
        setImageSource({ uri });
      }
    }
  },[])

  return <Image source={imageSource} style={style} resizeMode={resizeMode} />;
};

export default ImageView;
