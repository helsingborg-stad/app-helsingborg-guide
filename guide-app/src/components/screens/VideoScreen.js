import React, { memo, useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ViewContainer from "@shared-components/view_container";
import VideoPlayer from "@shared-components/VideoPlayer";
import Colors from "@assets/styles/Colors";

import { isFileInCache, getFilePathInCache } from "@utils/DownloadMediaUtils";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.black },
  mainContainer: { backgroundColor: "black" },
});

const VideoScreen = (props) => {
  const { route } = props;
  const { videoUrl, guideID } = route?.params || {};
  const [url, setUrl] = useState(null);

  useEffect(() => {
    setUri().then(() => null);
  }, []);

  const setUri = async () => {
    const uri = await tryLoadFromCache(guideID, videoUrl);
    setUrl(uri);
  };

  const tryLoadFromCache = async (guideId, uri) => {
    if (!guideId || !uri) {
      throw new Error("Null params passed");
    }

    try {
      const isInCache = await isFileInCache(`${guideId}`, uri);
      if (isInCache) {
        return `file://${getFilePathInCache(`${guideId}`, uri)}`;
      }
      return uri;
    } catch (err) {
      // do not care
      return uri;
    }
  };

  const displayVideoPlayer = () => {
    if (url) {
      return <VideoPlayer filePath={url} />;
    }
    return null;
  };

  const displayVideo = () => (
    <SafeAreaView style={styles.safeArea}>
      <ViewContainer style={styles.mainContainer}>
        {displayVideoPlayer()}
      </ViewContainer>
    </SafeAreaView>
  );

  return displayVideo();
};

export default memo(VideoScreen);
