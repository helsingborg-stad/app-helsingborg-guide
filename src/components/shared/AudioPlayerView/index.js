// @flow

import React, { Component } from "react";
import { Animated, Platform, SafeAreaView, Slider, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { Colors } from "../../../styles/";
import {
  togglePlay,
  releaseAudioFile,
  moveAudioSlider,
  moveAudioSliderComplete,
} from "../../../actions/audioActions";

import styles from "./style";

const ios = Platform.OS === "ios";

type Props = {
  audio: AudioState,
  dispatchTogglePlaying(): void,
  dispatchReleaseAudioFile(): void,
  dispatchMoveAudioSlider(position: number): void,
  dispatchMoveAudioSliderComplete(position: number): void,
}

type State = {
  animValue: Animated.Value
}

function displayControlButton(isPlaying: boolean, dispatchToggle: any): any {
  let btn = null;
  btn = isPlaying ? (
    <TouchableOpacity style={styles.closeBtnContainer} onPress={dispatchToggle}>
      <Icon name="pause" size={26} color="purple" />
    </TouchableOpacity>) : (
      <TouchableOpacity style={styles.closeBtnContainer} onPress={dispatchToggle}>
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

function onSliderValueCompleted(value: number, dispatchSliderMoveComplete: any): void {
  dispatchSliderMoveComplete(value);
}

function onSliderValueChanged(value: number, dispatchMoveAudioSlider: any, isMovingSlider: boolean) {
  if (!isMovingSlider) dispatchMoveAudioSlider(value);
}

class AudioPlayerView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animValue, { toValue: 1, duration: 1000 }).start();
  }

  render() {
    if (!this.props.audio.hasAudio || !this.props.audio.isPrepared) {
      return null;
    }

    return (
      <SafeAreaView style={styles.audioPlayer}>
        <Animated.View style={[styles.playerContainer, { opacity: this.state.animValue }]}>
          <View style={styles.sliderAndTitleContainer}>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={[styles.titleText, !this.props.audio.isPrepared ? styles.disabledText : {}]}>
                {this.props.audio.title}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              {displayControlButton(this.props.audio.isPlaying, this.props.dispatchTogglePlaying)}
              <Text style={styles.durationText}>{getDurationString(this.props.audio.currentPosition)}</Text>
              <View style={styles.slider}>
                <Slider
                  disabled={!this.props.audio.isPrepared}
                  style={styles.trackSlider}
                  maximumValue={this.props.audio.duration}
                  value={this.props.audio.currentPosition}
                  minimumTrackTintColor={Colors.purple}
                  onValueChange={value => onSliderValueChanged(value, this.props.dispatchMoveAudioSlider, this.props.audio.isMovingSlider)}
                  onSlidingComplete={value => onSliderValueCompleted(value, this.props.dispatchMoveAudioSliderComplete)}
                />
              </View>
              <Text style={styles.durationText}>{getDurationString(this.props.audio.duration)}</Text>
              <TouchableOpacity style={styles.closeBtnContainer} onPress={this.props.dispatchReleaseAudioFile}>
                <Icon2 name="cancel" color={Colors.warmGrey} size={32} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView >
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    audio: state.audio,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchTogglePlaying: () => dispatch(togglePlay()),
    dispatchReleaseAudioFile: () => dispatch(releaseAudioFile()),
    dispatchMoveAudioSlider: position => dispatch(moveAudioSlider(position)),
    dispatchMoveAudioSliderComplete: position => dispatch(moveAudioSliderComplete(position)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerView);
