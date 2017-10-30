/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Slider, Image, LayoutAnimation, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import RoundedBtn from "./roundedBtn";
import { MediaService } from "../../services/mediaService";
import { connect } from "react-redux";
import * as audioActions from "../../actions/audioActions";
import { bindActionCreators } from "redux";

const PLAYER_HEIGHT = 70;
const BTN_DIM = 36;
const BKD_COLOR = "#F2F2F2";

class MediaPlayer extends Component {
  timer;
  mediaService;

  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      duration: 0,
      disabled: true,
      isSliding: false,
      audio: this.props.audio,
    };

    this.mediaService = MediaService.getInstance();
    this.onAudioFilePrepared = this.onAudioFilePrepared.bind(this);
  }

  componentDidMount() {
    this.mediaService.onPrepared(this.onAudioFilePrepared);
    if (this.state.audio.prepared) this.config();
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Mediaplayer will receive props');
    this.setState({ audio: nextProps.audio });
    if (!nextProps.audio.prepared && this.timer) clearInterval(this.timer);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
    this.mediaService.unSubscribeOnPrepared(this.onAudioFilePrepared);
  }

  onAudioFilePrepared() {
    // console.log('Mediaplayer: file is prepared');
    this.config();
  }

  config() {
    this.mediaService.getMeta().then((meta) => {
      // console.log('media file meta', meta);
      this.setState({ ...meta, disabled: false });
    });
    this.updateSliderValue();
  }

  onError() {
    this.onPlayCompleted();
  }

  togglePlaying() {
    if (this.state.audio.isPlaying) this.pause();
    else this.play();
  }

  play() {
    this.mediaService.start();
    this.props.audioActions.togglePlay(true);
  }

  pause() {
    this.mediaService.pause();
    this.props.audioActions.togglePlay(false);
  }

  stop() {
    this.mediaService.stop();
    this.setState({ disabled: true });
    this.props.audioActions.togglePlay(false);
  }

  updateSliderValue() {
    this.timer = setInterval(() => {
      if (!this.state.isSliding && this.state.audio.prepared) {
        this.mediaService
          .getCurrentPosition()
          .then(position => this.setState({ currentPosition: position }))
          .catch(err => clearInterval(this.timer));
      }
    }, 700);
  }

  onSliding() {
    this.setState({ isSliding: true });
  }

  onSliderValueCompleted(value) {
    this.mediaService.seekTo(value);
    this.setState({ isSliding: false });
  }

  displayControlBtn() {
    const btn = (
      <RoundedBtn
        style={styles.playBtn}
        disabled={this.state.disabled}
        isActive={this.state.audio.isPlaying}
        active={<Icon name="pause" size={BTN_DIM / 2} color="white" />}
        idle={<Icon name="play" size={BTN_DIM / 2} color="white" />}
        onPress={() => {
          this.togglePlaying();
        }}
      />
    );

    const spinner = <ActivityIndicator style={[styles.centering]} />;

    const button = this.state.audio.prepared ? btn : spinner;
    return <View style={styles.controlsContainer}>{button}</View>;
  }

  render() {
    return (
      <View style={styles.playerContainer}>
        {this.displayControlBtn()}
        <View style={styles.sliderAndTitleContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, !this.state.audio.prepared ? styles.disabledText : {}]}>{this.state.audio.title}</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              disabled={!this.state.audio.prepared}
              style={styles.trackSlider}
              maximumValue={this.state.duration}
              value={this.state.currentPosition}
              onValueChange={value => this.onSliding()}
              onSlidingComplete={value => this.onSliderValueCompleted(value)}
            />
          </View>
        </View>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: this.state.audio.avatar_url }} style={styles.avatar} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playerContainer: {
    height: PLAYER_HEIGHT,
    backgroundColor: BKD_COLOR,
    flex: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sliderAndTitleContainer: {
    flex: 5,
    // backgroundColor:'#f5f5f5',
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingHorizontal: 10,
  },
  sliderContainer: {
    flex: 2,
    alignItems: "stretch",
  },
  titleContainer: { flex: 1, alignItems: "stretch", paddingHorizontal: 10 },
  titleText: { fontSize: 12, lineHeight: 14, fontWeight: "bold" },
  disabledText: { color: "#cecece" },
  trackSlider: { flex: 1 },
  controlsContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  playBtn: { width: BTN_DIM, height: BTN_DIM, backgroundColor: "#D35098" },
  control: { flex: 1, alignItems: "center" },
  avatarContainer: { flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 40 },
  spinner: {},
});

function mapStateToProps(state, ownProps) {
  // console.log('hasAudio',state);
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
