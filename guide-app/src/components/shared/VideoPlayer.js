import React, { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/MaterialIcons";
import TimeHelper from "@src/lib/timeHelper";
import ViewContainer from "@shared-components/view_container";
import useStateCallback from "../../hooks/useStateCallback";

const { FullScreenVideoModule } = NativeModules;

const ICON_SIZE = 32;
const BKGD_COLOR = "black";
const timeHelper = TimeHelper();

const ios = Platform.OS === "ios";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BKGD_COLOR,
  },
  innerWrapper: { flex: 4 },
  playerContainer: {
    height: 50,
    backgroundColor: BKGD_COLOR,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  trackSlider: {
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: "white",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  button: {
    width: 40,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    color: "white",
  },
});

type Props = {
  filePath: string,
  isAndroidFullscreen?: Boolean,
  playOnLoad?: Boolean,
  initialCurrentTime?: Number,
};

const VideoPlayer = (props: Props) => {
  const {
    playOnLoad = false,
    isAndroidFullscreen,
    filePath,
    initialCurrentTime,
  } = props || {};
  const [currentTime, setCurrentTime] = useState(0.0);
  const [isPlaying, setIsPlaying] = useStateCallback(playOnLoad);
  const [loading, setLoading] = useState(playOnLoad);
  const [duration, setDuration] = useState(null);
  const player = useRef(null);

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  const displaySpinner = () => {
    if (loading) {
      return <ActivityIndicator style={[styles.spinner]} />;
    }
    return null;
  };

  const renderPlayPauseButton = () => {
    return (
      <TouchableOpacity style={styles.button} onPress={() => togglePlayState()}>
        <Icon
          name={isPlaying ? "pause" : "play-arrow"}
          size={ICON_SIZE}
          style={styles.buttonIcon}
        />
      </TouchableOpacity>
    );
  };

  const togglePlayState = () => {
    setIsPlaying(!isPlaying);
  };

  const _changeCurrentTimeCompleted = (time) => {
    setCurrentTime(time);
  };

  const _changeCurrentTime = (time) => {
    player.current.seek(time);
    setIsPlaying(false);
    setCurrentTime(time);
  };

  const _onProgress = (timeObj) => {
    setCurrentTime(timeObj.currentTime);
  };

  const toggleFullscreen = () => {
    if (isAndroidFullscreen) {
      FullScreenVideoModule.collapse();
      return;
    }
    if (!player.current) {
      return;
    }

    if (ios) {
      player.presentFullscreenPlayer();
    } else {
      if (isPlaying) {
        setIsPlaying(false, () => {
          OpenFullScreenVideo();
        });
      }
    }
  };

  const OpenFullScreenVideo = () => {
    FullScreenVideoModule.open(filePath, !isPlaying, currentTime);
    FullScreenVideoModule.getPlayerStateOnCollapse().then((stateOnCollapse) => {
      const time = stateOnCollapse.currentTime;
      player.seek(time);
      setIsPlaying(!stateOnCollapse.paused);
      setCurrentTime(time);
    });
  };

  const onEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const onLoad = (data) => {
    if (initialCurrentTime) {
      player.seek(initialCurrentTime);
      setCurrentTime(initialCurrentTime);
    }
    setDuration(data.duration);
    setLoading(false);
  };

  if (isAndroidFullscreen) {
    FullScreenVideoModule.setFullscreenPlayState(!isPlaying, currentTime);
  }

  return (
    <ViewContainer style={styles.wrapper}>
      <View>{displaySpinner()}</View>
      <View style={styles.innerWrapper}>
        <Video
          source={{ uri: props.filePath }} // Can be a URL or a local file.
          ref={player} // Store reference
          rate={1.0} // 0 is paused, 1 is normal.
          muted={false} // Mutes the audio entirely.
          paused={!isPlaying} // Pauses playback entirely.
          resizeMode="contain" // Fill the whole screen at aspect ratio.*
          repeat={false} // Repeat forever.
          playInBackground={false} // Audio continues to play when app entering background.
          playWhenInactive={false} // [iOS] Video continues to play when control or notification center are shown.
          progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
          onLoad={onLoad} // Callback when video loads
          onProgress={(data) => _onProgress(data)} // Callback every ~250ms with currentTime
          onEnd={onEnd} // Callback when playback finishes
          onError={() => null} // Callback when video cannot be loaded
          onBuffer={() => null} // Callback when remote video is buffering
          onTimedMetadata={() => null} // Callback when the stream receive some metadata
          style={styles.backgroundVideo}
        />
      </View>

      <View style={styles.playerContainer}>
        {renderPlayPauseButton()}

        <View style={styles.sliderContainer}>
          <Text style={styles.duration}>
            {timeHelper.toTimeMarker(currentTime)}
          </Text>
          <Slider
            style={styles.trackSlider}
            maximumValue={duration}
            minimumValue={0}
            minimumTrackTintColor="grey"
            maximumTrackTintColor="white"
            thumbTintColor="white"
            value={currentTime}
            onValueChange={(data) => _changeCurrentTime(data)}
            onSlidingComplete={(data) => _changeCurrentTimeCompleted(data)}
          />
          <Text style={styles.duration}>
            {timeHelper.toTimeMarker(duration)}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={toggleFullscreen}>
          <Icon
            name={isAndroidFullscreen ? "fullscreen-exit" : "fullscreen"}
            size={ICON_SIZE}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </ViewContainer>
  );
};

export default memo(VideoPlayer);
