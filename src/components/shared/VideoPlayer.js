/**
 * Created by msaeed on 2017-02-04.
 */
import React, {
  Component,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Slider,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";
import TimeHelper from "../../lib/timeHelper";
import ViewContainer from "../shared/view_container";

const BKGD_COLOR = "black";
const FGD_COLOR = "#7B075E";
const timeHelper = TimeHelper();

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BKGD_COLOR,
  },
  playerContainer: {
    height: 50,
    backgroundColor: BKGD_COLOR,
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  sliderContainer: {
    flex: 4,
    // backgroundColor:'#f5f5f5',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  trackSlider: {
    flex: 8,
  },
  duration: {
    flex: 2,
    fontSize: 14,
    color: "white",
  },
  controlsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  control: {
    flex: 1,
    alignItems: "center",
  },
  audioLevelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  audioLevelIconContainer: {
    flex: 1,
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default class AudioPlayer extends Component {
  static propTypes = {
    filePath: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: true,
      currentTime: 0,
      volume: 0.7,
      duration: 100,
      loading: true,
    };
  }

  player;

  displaySpinner() {
    if (this.state.loading) {
      return <ActivityIndicator style={[styles.spinner]} />;
    }
  }

  togglePlayView(isPlaying) {
    if (!isPlaying) {
      return (
        <TouchableOpacity style={styles.control} onPress={() => this.onPlayPressed()}>
          <Icon name="play" size={20} color={FGD_COLOR} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.control} onPress={() => this.onPausePressed()}>
        <Icon name="pause" size={20} color={FGD_COLOR} />
      </TouchableOpacity>
    );
  }

  onPlayPressed() {
    this.setState({ isPlaying: true });
  }

  onPausePressed() {
    this.setState({ isPlaying: false });
  }

  _changeVolume(value) {
    this.setState({
      volume: value,
    });
  }

  _changeCurrentTimeCompleted(time) {
    this.setState({ currentTime: time });
  }

  _changeCurrentTime(time) {
    this.setState({ isPlaying: false });
    this.player.seek(time);
  }

  _onProgress(timeObj) {
    this.setState({ currentTime: timeObj.currentTime });
  }

  showFullScreen = () => {
    if (this.player) this.player.presentFullscreenPlayer();
  }

  onEnd = () => {
    this.setState({ isPlaying: false, currentTime: 0 });
  }

  onLoad = (data) => {
    this.setState({ duration: data.duration, currentTime: data.currentTime, loading: false });
  }

  loadStart = () => {
    this.setState({ loading: true });
  }

  render() {
    return (
      <ViewContainer style={styles.wrapper}>
        <View>{this.displaySpinner()}</View>
        <View style={{ flex: 4 }}>
          <Video
            source={{ uri: this.props.filePath }} // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref;
            }} // Store reference
            rate={1.0} // 0 is paused, 1 is normal.
            volume={this.state.volume} // 0 is muted, 1 is normal.
            muted={false} // Mutes the audio entirely.
            paused={!this.state.isPlaying} // Pauses playback entirely.
            resizeMode="center" // Fill the whole screen at aspect ratio.*
            repeat={false} // Repeat forever.
            playInBackground={false} // Audio continues to play when app entering background.
            playWhenInactive={false} // [iOS] Video continues to play when control or notification center are shown.
            progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
            onLoadStart={this.loadStart} // Callback when video starts to load
            onLoad={this.onLoad} // Callback when video loads
            onProgress={timeObj => this._onProgress(timeObj)} // Callback every ~250ms with currentTime
            onEnd={this.onEnd} // Callback when playback finishes
            onError={this.videoError} // Callback when video cannot be loaded
            onBuffer={() => this.onBuffer} // Callback when remote video is buffering
            onTimedMetadata={this.onTimedMetadata} // Callback when the stream receive some metadata
            style={styles.backgroundVideo}
          />
        </View>

        <View style={styles.playerContainer}>
          <View style={styles.controlsContainer}>{this.togglePlayView(this.state.isPlaying)}</View>

          <View style={styles.sliderContainer}>
            <Text style={styles.duration}>{timeHelper.toTimeMarker(this.state.currentTime)}</Text>
            <Slider
              style={styles.trackSlider}
              maximumValue={this.state.duration}
              minimumValue={0}
              value={this.state.currentTime}
              onValueChange={(value) => {
                this._changeCurrentTime(value);
              }}
              onSlidingComplete={value => this._changeCurrentTimeCompleted(value)}
            />
            <Text style={styles.duration}>{timeHelper.toTimeMarker(this.state.duration)}</Text>
          </View>

          <View style={styles.audioLevelContainer}>
            <View style={styles.audioLevelIconContainer}>
              <Icon name="volume-off" size={20} color={FGD_COLOR} />
            </View>
            <Slider
              style={styles.trackSlider}
              value={this.state.volume}
              maximumValue={1}
              minimumValue={0}
              onValueChange={value => this._changeVolume(value)}
            />
          </View>
        </View>
      </ViewContainer>
    );
  }
}

