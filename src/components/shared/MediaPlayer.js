/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Slider, ActivityIndicator, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RoundedBtn from "./roundedBtn";
import OImage from "./image";
import MediaService from "../../services/mediaService";
import * as audioActions from "../../actions/audioActions";

const PLAYER_HEIGHT = 70;
const BTN_DIM = 36;
const BKD_COLOR = "#F2F2F2";

class MediaPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: this.props.audio,
      animValue: new Animated.Value(0),
    };

    this.mediaService = MediaService.getInstance();
  }

  componentDidMount() {
    Animated.timing(this.state.animValue, { toValue: 1 }).start();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ audio: nextProps.audio });
  }

  componentWillUnmount() {}

  togglePlaying() {
    if (this.state.audio.isPlaying) this.pause();
    else this.play();
  }

  play() {
    this.mediaService.start();
  }

  pause() {
    this.mediaService.pause();
  }

  stop() {
    this.mediaService.stop();
    this.setState({ disabled: true });
  }

  updateSliderValue() {
    this.setState({ currentPosition: this.state.audio.currentPosition });
  }

  onSliding() {
    this.mediaService.pauseUpdatingState();
  }

  onSliderValueCompleted(value) {
    this.mediaService.seekTo(value);
    this.mediaService.resumeUpdatingState();
  }

  displayControlBtn() {
    const btn = (
      <RoundedBtn
        style={styles.playBtn}
        disabled={this.state.disabled}
        outline
        isActive={this.state.audio.isPlaying}
        active={<Icon name="pause" size={BTN_DIM / 2} color="white" />}
        idle={<Icon name="play" size={BTN_DIM / 2} color="white" />}
        onPress={() => {
          this.togglePlaying();
        }}
      />
    );

    const spinner = <ActivityIndicator style={[styles.spinner]} />;

    const button = this.state.audio.isPrepared ? btn : spinner;
    return <View style={styles.controlsContainer}>{button}</View>;
  }

  closePlayer() {
    this.mediaService.release();
  }

  render() {
    if (this.state.audio.hasAudio && this.state.audio.isPrepared) {
      return (
        <Animated.View style={[styles.playerContainer, { opacity: this.state.animValue }]}>
          <View style={styles.avatarContainer}>
            <OImage spinner={false} source={{ uri: this.state.audio.avatar_url }} style={styles.avatar} />
            {this.displayControlBtn()}
          </View>
          <View style={styles.sliderAndTitleContainer}>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={[styles.titleText, !this.state.audio.isPrepared ? styles.disabledText : {}]}>
                {this.state.audio.title}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                disabled={!this.state.audio.isPrepared}
                style={styles.trackSlider}
                maximumValue={this.state.audio.duration}
                value={this.state.audio.currentPosition}
                onValueChange={value => this.onSliding()}
                onSlidingComplete={value => this.onSliderValueCompleted(value)}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtnContainer} onPress={this.closePlayer.bind(this)}>
            <Icon2 name="close" size={25} />
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  playerContainer: {
    height: PLAYER_HEIGHT,
    backgroundColor: BKD_COLOR,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  sliderAndTitleContainer: {
    flex: 3,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingVertical: 10,
  },
  sliderContainer: {
    flex: 2,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },
  titleContainer: { flex: 1, alignItems: "stretch", paddingHorizontal: 15 },
  titleText: { fontSize: 12, lineHeight: 14, fontWeight: "bold" },
  disabledText: { color: "#cecece" },
  trackSlider: { flex: 1 },
  controlsContainer: {
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
    // flexDirection:'row',
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // backgroundColor:'red',
    top: 0,
    left: 0,
  },
  playBtn: { width: BTN_DIM, height: BTN_DIM, backgroundColor: "#D35098" },
  control: { flex: 1, alignItems: "center" },
  avatarContainer: {
    flex: 1,
    alignItems: "stretch",
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
  },

  avatar: {
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
  },
  spinner: {},
  closeBtnContainer: {
    flex: 1,
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT, // backgroundColor:'red',
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {},
});

function mapStateToProps(state, ownProps) {
  return {
    audio: state.audio,
    hasAudio: state.audio.hasAudio,
    isPlaying: state.audio.isPlaying,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    audioActions: bindActionCreators(audioActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayer);
