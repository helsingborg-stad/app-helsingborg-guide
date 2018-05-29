// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ObjectView from "../shared/ObjectView";
import LangService from "../../services/langService";
import { AnalyticsUtils } from "../../utils/";
import { selectCurrentContentObjectImage } from "../../actions/uiStateActions";
import fetchService from "../../services/FetchService";
import MediaService from "../../services/mediaService";
import { togglePlay, releaseAudioFile, loadAudioFile, loadAudioFileSuccess, updateAudio } from "../../actions/audioActions";

type Props = {
  audioState: AudioState,
  currentContentObject: ContentObject,
  currentContentObjectImageIndex: number,
  navigation: Object,
  selectCurrentContentObjectImage(newIndex: number): void,
  dispatchLoadAudioFile(audio: Object): void,
  dispatchLoadAudioFileSuccess(): void,
  dispatchReleaseAudioFile(): void,
  dispatchUpdateAudioState(audio: Object): void,
  dispatchTogglePlaying(play: boolean): void,
}

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
  constructor(props) {
    super(props);
    this.mediaService = MediaService.getInstance();
  }
  mediaService: any;

  onSwiperIndexChanged = (newIndex: number) => {
    this.props.selectCurrentContentObjectImage(newIndex);
  };

  onGoToImage = (image: Images) => {
    const { navigate } = this.props.navigation;
    navigate("ImageScreen", { image });
  };

  onGoToLink = (url: string, title?: string) => {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("open_url", { title });
    navigate("WebScreen", { url });
  };

  onAudioInited = (audio: Object) => {
    this.props.dispatchLoadAudioFile(audio);
  };

  onAudioPrepared = () => {
    this.props.dispatchLoadAudioFileSuccess();
  };

  onUpdateAudioState = (audio: Object) => {
    this.props.dispatchUpdateAudioState(audio);
  };

  loadAudioFile = () => {
    const { audio } = this.props.currentContentObject;

    if (!audio || !audio.url) return;

    if (this.props.audioState.hasAudio) this.mediaService.release();
    const audioName = audio.title;
    console.log(`load ${audioName}`);
    if (audioName) AnalyticsUtils.logEvent("play_audio", { name: audioName });

    const audioObject = {
      url: audio.url,
      title: this.props.currentContentObject.title || LangService.strings.UNKNOWN_TITLE,
      avatar_url: this.props.currentContentObject.images[0].thumbnail || "",
      hasAudio: true,
      isPlaying: true,
      description_plain: this.props.currentContentObject.description,
    };
    this.mediaService.init(audioObject,
      0/* offline guide id */,
      this.onAudioInited,
      this.onAudioPrepared,
      this.onUpdateAudioState); // TODO: offline
  };

  onClosePlayer = () => {
    this.mediaService.release();
    this.props.dispatchReleaseAudioFile();
  };

  onTogglePlaying = () => {
    if (this.props.audioState.isPlaying) {
      this.mediaService.pause();
      this.props.dispatchTogglePlaying(false);
    } else {
      this.mediaService.start();
      this.props.dispatchTogglePlaying(true);
    }
  }
  onSliding = (value: number) => {
    console.log(`obj screen slide ${value}`);
    this.mediaService.pauseUpdatingState();
  }

  onSliderValueCompleted = (value) => {
    this.mediaService.seekTo(value);
    this.mediaService.resumeUpdatingState();
  }

  render() {
    const { currentContentObject, currentContentObjectImageIndex } = this.props;
    const { params } = this.props.navigation.state;
    const { currentGuide } = params;


    return (<ObjectView
      contentObject={currentContentObject}
      guideType={currentGuide.guideType}
      onSwiperIndexChanged={this.onSwiperIndexChanged}
      imageIndex={currentContentObjectImageIndex}
      audioButtonDisabled={!isMediaAvailable(currentContentObject.audio)}
      videoButtonDisabled={!isMediaAvailable(currentContentObject.video)}
      onGoToImage={this.onGoToImage}
      onGoToLink={this.onGoToLink}
      loadAudioFile={this.loadAudioFile}
      onClosePlayer={this.onClosePlayer}
      onTogglePlaying={this.onTogglePlaying}
      onSliding={this.onSliding}
      onSliderValueCompleted={this.onSliderValueCompleted}

    />);
  }
}

function mapStateToProps(state: RootState) {
  const { currentContentObject, currentContentObjectImageIndex } = state.uiState;
  const audioState = state.audio;

  return {
    audioState,
    currentContentObject,
    currentContentObjectImageIndex,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentContentObjectImage: (newIndex: number) => dispatch(selectCurrentContentObjectImage(newIndex)),
    dispatchLoadAudioFile: (audio: any) => dispatch(loadAudioFile(audio)),
    dispatchLoadAudioFileSuccess: () => dispatch(loadAudioFileSuccess()),
    dispatchReleaseAudioFile: () => dispatch(releaseAudioFile()),
    dispatchUpdateAudioState: (audio: any) => dispatch(updateAudio(audio)),
    dispatchTogglePlaying: (play: boolean) => dispatch(togglePlay(play)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectScreen);
