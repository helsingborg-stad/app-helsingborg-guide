// @flow

import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import ObjectView from "@shared-components/ObjectView";
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
  route: Object,
  selectCurrentContentObjectImage(newIndex: number): void,
  selectCurrentImage(url: ?string): void,
  initAudioFile(audio: AudioState): void,
  pauseAudio(): void,
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
    fetchService.isExist(media.url /* , this.state.guideID */).then((exist) => {
      // TODO: and this?!
      available = exist;
    });
  }
  return available || internet;
}

const ObjectScreen = (props: Props) => {
  const { navigation, route } = props;
  const {
    path,
    array,
    order,
    swipeable,
    scrollable,
    panToIndex,
    selectObject,
    disableShare,
  } = route.params;
  const dispatch = useDispatch();
  const { currentGuide, currentContentObject, currentContentObjectImageIndex } = useSelector((s) => s.uiState);

  const onSwiperIndexChanged = (newIndex: number) => {
    dispatch(selectCurrentContentObjectImage(newIndex));
  };

  const onGoToImage = (image: Images) => {
    dispatch(selectCurrentImage(image.large));
    navigation.navigate("ImageScreen", { image });
  };

  const onGoToVideo = (video?: MediaContent) => {
    if (!video) {
      return;
    }
    if (!currentGuide) {
      return;
    }
    const guideID = currentGuide.id;
    dispatch(pauseAudio());
    const { url, title } = video;
    if (title) {
      trackEvent("play", "play_video", title);
      // AnalyticsUtils.logEvent("play_video", { title });
    }

    navigation.navigate("VideoScreen", { videoUrl: url, title, guideID });
  };

  const loadAudioFile = () => {

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
      // trackEvent("play", "play_audio", audioState?.title, audioState?.title, audioState?.url);
      // AnalyticsUtils.logEvent("play_audio", { name: audioState.title });
    }
    dispatch(initAudioFile(audioState));
  };

  let guideId;
  let guideType;
  if (currentGuide) {
    guideId = currentGuide.id;
    ({ guideType } = currentGuide);
  }

  return currentContentObject ? (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      <ObjectView
        contentObject={currentContentObject}
        guideId={guideId}
        guideType={guideType}
        path={path}
        array={array}
        order={order}
        selectObject={selectObject}
        navigation={navigation}
        swipeable={swipeable}
        scrollable={scrollable}
        panToIndex={panToIndex}
        onSwiperIndexChanged={onSwiperIndexChanged}
        imageIndex={currentContentObjectImageIndex}
        audioButtonDisabled={!isMediaAvailable(currentContentObject.audio)}
        videoButtonDisabled={!isMediaAvailable(currentContentObject.video)}
        onGoToImage={onGoToImage}
        loadAudioFile={loadAudioFile}
        onGoToVideo={onGoToVideo}
        disableShare={disableShare}
      />
    </>
  ) : null;
};

export default ObjectScreen;
