// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ObjectView from "../shared/ObjectView";
import { AnalyticsUtils } from "../../utils/";
import LangService from "../../services/langService";
import fetchService from "../../services/FetchService";
import { initAudioFile, pauseAudio } from "../../actions/audioActions";
import { selectCurrentContentObjectImage, selectCurrentImage } from "../../actions/uiStateActions";
import { HeaderStyles } from "../../styles";

type Props = {
  currentGuide: ?Guide,
  currentContentObject: ?ContentObject,
  currentContentObjectImageIndex: number,
  navigation: Object,
  selectCurrentContentObjectImage(newIndex: number): void,
  selectCurrentImage(url: ?string): void,
  dispatchInitAudioFile(audio: AudioState): void,
  dispatchPauseAudio(): void
}

const defaultState: AudioState = {
  url: "",
  title: "",
  avatar_url: "",
  hasAudio: false,
  isPrepared: false,
  isPlaying: true,
  duration: 0,
  currentPosition: 0,
  isMovingSlider: false,
};

function isMediaAvailable(media?: MediaContent): boolean {
  const internet = true; // TODO: how will this work?
  let available = false;
  if (media && media.url) {
    fetchService.isExist(media.url/* , this.state.guideID */).then((exist) => { // TODO: and this?!
      available = (exist);
    });
  }
  return available || internet;
}

class ObjectScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return Object.assign(HeaderStyles.noElevation, {
      title,
    });
  }

  onSwiperIndexChanged = (newIndex: number) => {
    this.props.selectCurrentContentObjectImage(newIndex);
  };

  onGoToImage = (image: Images) => {
    this.props.selectCurrentImage(image.large);
    const { navigate } = this.props.navigation;
    navigate("ImageScreen", { image });
  };

  onGoToLink = (url: string, title?: string) => {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("open_url", { title });
    navigate("WebScreen", { url });
  };

  onGoToVideo = (video?: MediaContent) => {
    if (!video) { return; }
    const { currentGuide } = this.props;
    if (!currentGuide) return;
    const guideID = currentGuide.id;

    this.props.dispatchPauseAudio();

    const { url, title } = video;
    if (title) AnalyticsUtils.logEvent("play_video", { title });

    const { navigate } = this.props.navigation;
    navigate("VideoScreen", { videoUrl: url, title, guideID });
  }

  loadAudioFile = () => {
    const { currentContentObject } = this.props;
    if (!currentContentObject) return;

    const { audio, title } = currentContentObject;

    if (!audio || !audio.url) return;

    const audioState: AudioState = defaultState;

    audioState.title = title || LangService.strings.UNKNOWN_TITLE;
    audioState.avatar_url = currentContentObject.images[0].thumbnail || "";
    audioState.url = audio.url;

    if (audioState.title) AnalyticsUtils.logEvent("play_audio", { name: audioState.title });

    this.props.dispatchInitAudioFile(audioState);
  };


  render() {
    const { currentContentObject, currentContentObjectImageIndex, currentGuide } = this.props;
    if (!currentContentObject) return null;
    let guideId;
    let guideType;
    if (currentGuide) {
      guideId = currentGuide.id;
      ({ guideType } = currentGuide);
    }

    return (<ObjectView
      contentObject={currentContentObject}
      guideId={guideId}
      guideType={guideType}
      onSwiperIndexChanged={this.onSwiperIndexChanged}
      imageIndex={currentContentObjectImageIndex}
      audioButtonDisabled={!isMediaAvailable(currentContentObject.audio)}
      videoButtonDisabled={!isMediaAvailable(currentContentObject.video)}
      onGoToImage={this.onGoToImage}
      onGoToLink={this.onGoToLink}
      loadAudioFile={this.loadAudioFile}
      onGoToVideo={this.onGoToVideo}
    />);
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide, currentContentObject, currentContentObjectImageIndex } = state.uiState;

  return {
    currentGuide,
    currentContentObject,
    currentContentObjectImageIndex,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentContentObjectImage: (newIndex: number) => dispatch(selectCurrentContentObjectImage(newIndex)),
    dispatchInitAudioFile: (audio: AudioState) => dispatch(initAudioFile(audio)),
    dispatchPauseAudio: () => dispatch(pauseAudio()),
    selectCurrentImage: (url: ?string) => dispatch(selectCurrentImage(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectScreen);
