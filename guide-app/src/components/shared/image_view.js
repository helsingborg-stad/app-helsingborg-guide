import React, { memo, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import OImage from "./image";

const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.65;

const styles = StyleSheet.create({
  imageContainer: {},
  image: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: { flex: 1, width: 100, height: 100 },
});

type Props = {
  source: any,
  guideID: any,
  width: any,
  height: any,
  blur: any,
  children: Array,
};

const ImageView = (props: Props) => {
  const { source, guideID, width, height, blur, children } = props;
  const [loading, setLoading] = useState(false);

  const onLoadStart = () => {
    setLoading(true);
  };
  const onLoadEnd = () => {
    setLoading(false);
  };

  const _getOptWidth = (width) => {
    return width * (Dimensions.get("window").width / width);
  };

  const _getOptHeight = (height) => {
    return height * (Dimensions.get("window").height / height);
  };

  const displaySpinner = () => {
    if (loading) {
      return <ActivityIndicator style={[styles.spinner]} />;
    }
  };

  const displayImage = () => {
    // If no source image is defined, use placeholder image
    let uri = source;
    if (!uri || !uri.uri) {
      uri = require("@assets/images/no-image-featured-image.png");
    }

    // Using full screen width and a 16:9 aspect ratio
    let displayWidth = Dimensions.get("window").width;
    let displayHeight = (displayWidth / 16) * 9;

    // If height and/or width is defined, use that instead
    if (width) {
      displayWidth = _getOptWidth(width);
    }
    if (height) {
      displayHeight = _getOptHeight(height);
    }

    const displayStyle = {
      width: displayWidth,
      height: displayHeight,
      maxHeight: MAX_IMAGE_HEIGHT,
      zIndex: 1000,
    };

    return (
      <OImage
        style={[displayStyle, styles.image]}
        source={uri}
        blurRadius={blur}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        guideID={guideID}
      >
        {displaySpinner()}
        {children}
      </OImage>
    );
  };
  return <View style={styles.imageContainer}>{displayImage()}</View>;
};

export default memo(ImageView);
