import React, { useEffect, useState } from "react";
import { NativeModules } from "react-native";
import VideoPlayer from "@shared-components/VideoPlayer";

const { FullScreenVideoModule } = NativeModules;

const flexStyle = { flex: 1 };

const FullScreenVideoScreen = () => {
  const [url, setUrl] = useState(null);
  const [paused, setPaused] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    getParameters().then(() => null);
  }, []);

  const getParameters = async () => {
    const parameters = await FullScreenVideoModule.getVideoParameters();
    setUrl(parameters.url);
    setPaused(parameters.paused);
    setCurrentTime(parameters.currentTime);
  };

  return (
    url && (
      <VideoPlayer
        containerStyle={flexStyle}
        style={flexStyle}
        isAndroidFullscreen
        playOnLoad={!paused}
        initialCurrentTime={currentTime}
        filePath={url}
      />
    )
  );
};

export default FullScreenVideoScreen;
