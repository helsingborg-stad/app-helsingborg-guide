import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const FULL_WIDTH = Dimensions.get("window").width;
const FULL_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  spinner: {
    flex: 3,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

type Props = {
  source: any,
  blurRadius: ?number,
  style: ?Object,
};

const BackgroundImage = (props: Props) => {
  const { source, blurRadius, style } = props;

  const [loading, setLoading] = useState(false);

  const onLoadStart = () => {
    setLoading(true);
  };

  const onLoadEnd = () => {
    setLoading(false);
  };

  const displaySpinner = () => {
    if (loading) {
      return <ActivityIndicator style={[styles.spinner]} />;
    }
    return null;
  };

  const displayImage = () => {
    const imageSize = {
      width: FULL_WIDTH,
      height: FULL_HEIGHT,
    };

    return (
      <View>
        <Image
          style={[styles.image, imageSize]}
          source={source}
          blurRadius={blurRadius || 0}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          resizeMethod="scale"
          resizeMode="cover"
        />
        {displaySpinner()}
      </View>
    );
  };

  return (
    <View style={[styles.imageContainer, style || {}]}>{displayImage()}</View>
  );
};

export default BackgroundImage;
