// @flow

import React, { Component } from "react";
import { StatusBar } from "react-native";
import { connect } from "react-redux";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import ObjectView from "@shared-components/ObjectView";
import { AnalyticsUtils } from "@utils";
import LangService from "@services/langService";
import fetchService from "@services/FetchService";
import { initAudioFile, pauseAudio } from "@actions/audioActions";
import {
  selectCurrentContentObjectImage,
  selectCurrentImage
} from "@actions/uiStateActions";
import { Colors, HeaderStyles } from "@assets/styles";
import { trackEvent } from "@utils/MatomoUtils";


type Props = {
  currentGuide: ?Guide,
  currentContentObject: ?ContentObject,
  currentContentObjectImageIndex: number,
  navigation: Object,
  selectCurrentContentObjectImage(newIndex: number): void,
  selectCurrentImage(url: ?string): void,
  dispatchInitAudioFile(audio: AudioState): void,
  dispatchPauseAudio(): void
};

const defaultState: AudioState = {
  url: "",
  title: "",
  avatar_url: "",
  hasAudio: false,
  isPrepared: false,
  isPlaying: true,
  duration: 0,
  currentPosition: 0,
  isMovingSlider: false
};

function isMediaAvailable(media?: MediaContent): boolean {
  const internet = true; // TODO: how will this work?
  let available = false;
  if (media && media.url) {
    fetchService.isExist(media.url /* , this.state.guideID */).then(exist => {
      // TODO: and this?!
      available = exist;
    });
  }
  return available || internet;
}

class ObjectScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title,
      headerLeft: () => <HeaderBackButton navigation={navigation} />
    };
  };

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
    trackEvent("open", "open_url", title, title, url);
    AnalyticsUtils.logEvent("open_url", { title });
    navigate("WebScreen", { url });
  };

  onGoToVideo = (video?: MediaContent) => {
    if (!video) {
      return;
    }
    const { currentGuide } = this.props;
    if (!currentGuide) {
      return;
    }
    const guideID = currentGuide.id;

    this.props.dispatchPauseAudio();

    const { url, title } = video;
    if (title) {
      trackEvent("play", "play_video", title, title, url);
      AnalyticsUtils.logEvent("play_video", { title });
    }

    const { navigate } = this.props.navigation;
    navigate("VideoScreen", { videoUrl: url, title, guideID });
  };

  loadAudioFile = () => {

    const { currentContentObject } = this.props;
    if (!currentContentObject) {
      return;
    }

    const { audio, title } = currentContentObject;


    if (!audio || !audio.url) {
      return;
    }

    const audioState: AudioState = defaultState;

    audioState.title = title || LangService.strings.UNKNOWN_TITLE;
    audioState.avatar_url = currentContentObject.images[0].thumbnail || "";
    audioState.url = audio.url;

    if (audioState.title) {
      trackEvent("play", "play_audio", audioState?.title, audioState?.title, audioState?.url);
      // AnalyticsUtils.logEvent("play_audio", { name: audioState.title });
    }

    this.props.dispatchInitAudioFile(audioState);
  };

  render() {
    console.log(this.loadAudioFile, "audio file")
    const {
      currentContentObject,
      currentContentObjectImageIndex,
      currentGuide,
      navigation,
    } = this.props

    const { selectObject, index, array, prevIndex } = this.props.navigation.state.params;

    console.log("prevIndex", prevIndex, "index", index)
    if (!currentContentObject) {
      return null;
    }
    let guideId;
    let guideType;
    if (currentGuide) {
      guideId = currentGuide.id;
      ({ guideType } = currentGuide);
    }

    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <ObjectView
          contentObject={currentContentObject}
          guideId={guideId}
          guideType={guideType}
          array={array}
          index={index}
          prevIndex={prevIndex}
          selectObject={selectObject}
          navigation={navigation}
          onSwiperIndexChanged={this.onSwiperIndexChanged}
          imageIndex={currentContentObjectImageIndex}
          audioButtonDisabled={!isMediaAvailable(currentContentObject.audio)}
          videoButtonDisabled={!isMediaAvailable(currentContentObject.video)}
          onGoToImage={this.onGoToImage}
          onGoToLink={this.onGoToLink}
          loadAudioFile={this.loadAudioFile}
          onGoToVideo={this.onGoToVideo}
        />
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const {
    currentGuide,
    currentContentObject,
    currentContentObjectImageIndex
  } = state.uiState;

  return {
    currentGuide,
    currentContentObject,
    currentContentObjectImageIndex
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentContentObjectImage: (newIndex: number) =>
      dispatch(selectCurrentContentObjectImage(newIndex)),
    dispatchInitAudioFile: (audio: AudioState) =>
      dispatch(initAudioFile(audio)),
    dispatchPauseAudio: () => dispatch(pauseAudio()),
    selectCurrentImage: (url: ?string) => dispatch(selectCurrentImage(url))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectScreen);
