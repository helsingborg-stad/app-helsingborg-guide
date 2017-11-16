import React, {
  Component,
} from "react";
import {
  ActivityIndicator,
  Platform,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
} from "react-native";
import PropTypes from "prop-types";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/MaterialIcons";
import TimeHelper from "../../lib/timeHelper";
import ViewContainer from "../shared/view_container";

const { FullScreenVideoModule } = NativeModules;

const ICON_SIZE = 32;
const BKGD_COLOR = "black";
const timeHelper = TimeHelper();

const ios = Platform.OS === "ios";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BKGD_COLOR,
  },
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

export default class VideoPlayer extends Component {
  static propTypes = {
    filePath: PropTypes.string.isRequired,
    isAndroidFullscreen: PropTypes.bool,
    playOnLoad: PropTypes.bool,
    initialCurrentTime: PropTypes.number,
  }

  static defaultProps = {
    isAndroidFullscreen: false,
    playOnLoad: true,
    initialCurrentTime: 0,
  }

  state = {
    currentTime: 0.0,
  }

  componentWillMount() {
    const { playOnLoad } = this.props;
    this.setState({ isPlaying: playOnLoad, loading: playOnLoad });
  }

  displaySpinner() {
    if (this.state.loading) {
      return <ActivityIndicator style={[styles.spinner]} />;
    }
    return null;
  }

  renderPlayPauseButton(isPlaying) {
    return (
      <TouchableOpacity style={styles.button} onPress={() => this.togglePlayState()}>
        <Icon name={isPlaying ? "pause" : "play-arrow"} size={ICON_SIZE} style={styles.buttonIcon} />
      </TouchableOpacity>
    );
  }

  togglePlayState() {
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying });
  }

  _changeCurrentTimeCompleted(time) {
    this.setState({ currentTime: time });
  }

  _changeCurrentTime(time) {
    this.player.seek(time);
    this.setState({ isPlaying: false, currentTime: time });
  }

  _onProgress(timeObj) {
    this.setState({ currentTime: timeObj.currentTime });
  }

  toggleFullscreen = () => {
    const { isAndroidFullscreen } = this.props;
    if (isAndroidFullscreen) {
      FullScreenVideoModule.collapse();
      return;
    }

    if (!this.player) return;

    if (ios) {
      this.player.presentFullscreenPlayer();
    } else {
      const { filePath } = this.props;
      const { isPlaying, currentTime } = this.state;

      if (isPlaying) this.setState({ isPlaying: false });

      FullScreenVideoModule.open(filePath, !isPlaying, currentTime);

      FullScreenVideoModule.getPlayerStateOnCollapse().then((stateOnCollapse) => {
        const time = stateOnCollapse.currentTime;
        this.player.seek(time);
        this.setState({ isPlaying: !stateOnCollapse.paused, currentTime: time });
      });
    }
  }

  onEnd = () => {
    this.setState({ isPlaying: false, currentTime: 0 });
  }

  onLoad = (data) => {
    const { initialCurrentTime } = this.props;
    if (initialCurrentTime) {
      this.player.seek(initialCurrentTime);
      this.setState({ currentTime: initialCurrentTime });
    }
    this.setState({ duration: data.duration, loading: false });
  }

  render() {
    const { isPlaying, currentTime } = this.state;
    const { isAndroidFullscreen } = this.props;
    if (isAndroidFullscreen) {
      FullScreenVideoModule.setFullscreenPlayState(!isPlaying, currentTime);
    }

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
            muted={false} // Mutes the audio entirely.
            paused={!isPlaying} // Pauses playback entirely.
            resizeMode="contain" // Fill the whole screen at aspect ratio.*
            repeat={false} // Repeat forever.
            playInBackground={false} // Audio continues to play when app entering background.
            playWhenInactive={false} // [iOS] Video continues to play when control or notification center are shown.
            progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)
            onLoad={this.onLoad} // Callback when video loads
            onProgress={data => this._onProgress(data)} // Callback every ~250ms with currentTime
            onEnd={this.onEnd} // Callback when playback finishes
            onError={this.videoError} // Callback when video cannot be loaded
            onBuffer={() => this.onBuffer} // Callback when remote video is buffering
            onTimedMetadata={this.onTimedMetadata} // Callback when the stream receive some metadata
            style={styles.backgroundVideo}
          />
        </View>

        <View style={styles.playerContainer} >
          {this.renderPlayPauseButton(isPlaying)}

          <View style={styles.sliderContainer}>
            <Text style={styles.duration}>{timeHelper.toTimeMarker(currentTime)}</Text>
            <Slider
              style={styles.trackSlider}
              maximumValue={this.state.duration}
              minimumValue={0}
              minimumTrackTintColor="grey"
              maximumTrackTintColor="white"
              thumbTintColor="white"
              value={currentTime}
              onValueChange={data =>
                this._changeCurrentTime(data)
              }
              onSlidingComplete={data =>
                this._changeCurrentTimeCompleted(data)
              }
            />
            <Text style={styles.duration}>{timeHelper.toTimeMarker(this.state.duration)}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.toggleFullscreen}>
            <Icon name={isAndroidFullscreen ? "fullscreen-exit" : "fullscreen"} size={ICON_SIZE} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </ViewContainer>
    );
  }
}
