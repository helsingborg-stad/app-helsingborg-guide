// @flow
import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import PhotoView from "react-native-photo-view";
import { useSelector } from "react-redux";
import { loadFromCache } from "@utils/DownloadMediaUtils";
import styles from "./styles";

const MAX_SCALE = 2.5;
const MIN_SCALE = 0.95;

const ImageScreen = () => {
  const { currentGuide, currentImage: url } = useSelector((s) => s.uiState);
  const { id: guideId } = currentGuide || {};
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    tryLoadFromCache(guideId, url);
  }, []);

  const tryLoadFromCache = async (
    id: ?number,
    uri: ?string
  ): Promise<any> => {
    if (!id || !uri) {
      throw new Error("Null params passed");
    }

    try {
      const data = await loadFromCache(`${id}`, uri);
      setImageSource({ uri: `data:image/png;base64,${data}` });
    } catch (err) {
      // do not care
      setImageSource({ uri });
    }
  };

  const renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
  if (!imageSource) {
    return renderLoadingScreen();
  }

  return (
    <PhotoView
      source={imageSource}
      minimumZoomScale={MIN_SCALE}
      maximumZoomScale={MAX_SCALE}
      androidScaleType="centerInside"
      style={styles.container}
    />
  );
};

export default memo(ImageScreen)
