// @flow

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "@assets/styles";
import {
  togglePlay,
  releaseAudioFile,
  moveAudioSlider,
  moveAudioSliderComplete,
} from "@actions/audioActions";

import styles from "./style";

const ios = Platform.OS === "ios";

function displayControlButton(isPlaying: boolean, dispatchToggle: any): any {
  let btn = null;
  btn = isPlaying ? (
    <TouchableOpacity style={styles.closeBtnContainer} onPress={dispatchToggle}>
      <Icon name="pause" size={26} color={Colors.themeControl} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.closeBtnContainer} onPress={dispatchToggle}>
      <Icon name="play" size={26} color={Colors.themeControl} />
    </TouchableOpacity>
  );
  return btn;
}

function displayLoadingSpinner(
  isPlaying: boolean,
  currentPosition: number
): any {
  if (isPlaying && currentPosition === 0.0) {
    return <ActivityIndicator style={styles.loadingSpinner} />;
  }

  return null;
}

function padWithZeros(time: number): string {
  return time > 9 ? `${time}` : `0${time}`;
}

function getDurationString(currentPosition: number): string {
  let totalSecondsModified = currentPosition;
  if (!ios) {
    totalSecondsModified /= 1000;
  }

  const hours = Math.floor(totalSecondsModified / 3600);
  const remainingSeconds = totalSecondsModified % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  if (hours > 0) {
    return `${hours}:${padWithZeros(minutes)}:${padWithZeros(seconds)}`;
  }

  return `${minutes}:${padWithZeros(seconds)}`;
}

function onSliderValueCompleted(
  value: number,
  dispatchSliderMoveComplete: any
): void {
  dispatchSliderMoveComplete(value);
}

function onSliderValueChanged(
  value: number,
  dispatchMoveAudioSlider: any,
  isMovingSlider: boolean
) {
  if (!isMovingSlider) {
    dispatchMoveAudioSlider(value);
  }
}

const AudioPlayerView = () => {
  const [animValue] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const audio = useSelector((s) => s.audio);


  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  if (!audio.hasAudio || !audio.isPrepared) {
    return null;
  }

  return (
    <SafeAreaView style={styles.audioPlayer}>
      <Animated.View style={[styles.playerContainer, { opacity: animValue }]}>
        <View style={styles.sliderAndTitleContainer}>
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.titleText,
                !audio.isPrepared ? styles.disabledText : {},
              ]}
            >
              {audio.title}
            </Text>
            {displayLoadingSpinner(audio.isPlaying, audio.currentPosition)}
          </View>
          <View style={styles.sliderContainer}>
            {displayControlButton(audio.isPlaying, () =>
              dispatch(togglePlay())
            )}
            <Text style={styles.durationText}>
              {getDurationString(audio.currentPosition)}
            </Text>
            <View style={styles.slider}>
              <Slider
                disabled={!audio.isPrepared}
                style={styles.trackSlider}
                maximumValue={audio.duration}
                value={audio.currentPosition}
                minimumTrackTintColor={Colors.themePrimary}
                onValueChange={(value) =>
                  onSliderValueChanged(
                    value,
                    (position) => dispatch(moveAudioSlider(position)),
                    audio.isMovingSlider
                  )
                }
                onSlidingComplete={(value) =>
                  onSliderValueCompleted(value, (position) =>
                    dispatch(moveAudioSliderComplete(position))
                  )
                }
              />
            </View>
            <Text style={styles.durationText}>
              {getDurationString(audio.duration)}
            </Text>
            <TouchableOpacity
              style={styles.closeBtnContainer}
              onPress={() => dispatch(releaseAudioFile())}
            >
              <Icon2 name="cancel" color={Colors.gray3} size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AudioPlayerView;
