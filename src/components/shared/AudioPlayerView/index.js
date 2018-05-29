// @flow

import React from "react";
import { Animated, Platform, SafeAreaView, Slider, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { Colors } from "../../../styles/";

import styles from "./style";

const ios = Platform.OS === "ios";

type Props = {
  audio: AudioState,
  onClosePlayer: () => (void),
  onTogglePlaying: () => (void),
  onSlidingCallback: (value: number) => (void),
  onSliderValueCompletedCallback: (newPosition: number) => (void),
}

type State = {
  animValue: number
}

function displayControlButton(isPlaying: boolean, onTogglePlaying: () => (void)): void {
  let btn = null;
  btn = isPlaying ? (
    <TouchableOpacity style={styles.closeBtnContainer} onPress={onTogglePlaying}>
      <Icon name="pause" size={26} color="purple" />
    </TouchableOpacity>) : (
      <TouchableOpacity style={styles.closeBtnContainer} onPress={onTogglePlaying}>
        <Icon name="play" size={26} color="purple" />
      </TouchableOpacity >);
  return btn;
}

function padWithZeros(time: number): string {
  return time > 9 ? `${time}` : `0${time}`;
}

function getDurationString(currentPosition: number): string {
  let totalSecondsModified = currentPosition;
  if (!ios) { totalSecondsModified /= 1000; }

  const hours = Math.floor(totalSecondsModified / 3600);
  const remainingSeconds = totalSecondsModified % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  if (hours > 0) {
    return `${hours}:${padWithZeros(minutes)}:${padWithZeros(seconds)}`;
  }

  return `${minutes}:${padWithZeros(seconds)}`;
}

function onSliding(value: number, onSlidingCallback: (value: number) => (void)): void {
  onSlidingCallback(value);
}

function onSliderValueCompleted(value: number, onSliderValueCompletedCallback: (newPosition: number) => (void)): void {
  onSliderValueCompletedCallback(value);
}

const AudioPlayerView = (props: Props, state: State) => {
  if (!props.audio.hasAudio || !props.audio.isPrepared) {
    return null;
  }


  return (
    <SafeAreaView style={styles.audioPlayer}>
      <Animated.View style={[styles.playerContainer, { opacity: state.animValue }]}>
        <View style={styles.sliderAndTitleContainer}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={[styles.titleText, !props.audio.isPrepared ? styles.disabledText : {}]}>
              {props.audio.title}
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            {displayControlButton(props.audio.isPlaying, props.onTogglePlaying)}
            <Text style={styles.durationText}>{getDurationString(props.audio.currentPosition)}</Text>
            <View style={styles.slider}>
              <Slider
                disabled={!props.audio.isPrepared}
                style={styles.trackSlider}
                maximumValue={props.audio.duration}
                value={props.audio.currentPosition}
                minimumTrackTintColor={Colors.purple}
                onValueChange={value => onSliding(value, props.onSlidingCallback)}
                onSlidingComplete={value => onSliderValueCompleted(value, props.onSliderValueCompletedCallback)}
              />
            </View>
            <Text style={styles.durationText}>{getDurationString(props.audio.duration)}</Text>
            <TouchableOpacity style={styles.closeBtnContainer} onPress={props.onClosePlayer}>
              <Icon2 name="cancel" color={Colors.warmGrey} size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView >
  );
};

function mapStateToProps(state: RootState) {
  return {
    audio: state.audio,
  };
}

export default connect(mapStateToProps)(AudioPlayerView);
