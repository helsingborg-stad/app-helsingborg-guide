// @flow

import React, { Component, useEffect, useRef, useState, Animated} from "react";
import {SafeAreaView, View, Text, ScrollView, Linking } from "react-native";

import styles from "./style";
import { Colors } from "@assets/styles";
import SharingService from "@services/SharingService";
import ButtonsBar from "@shared-components/btn_bar";
import ButtonsBarItem from "@shared-components/btn_bar_item";
import ImageSwiper from "@shared-components/ImageSwiper";
import LangService from "@services/langService";
import LinkTouchable from "@shared-components/LinkTouchable";
import AudioPlayerView from "@shared-components/AudioPlayerView";
import { openLink } from "@hooks/useOpenLink";
import Icon from "react-native-vector-icons/Entypo";

type Props = {
  contentObject: ContentObject,
  guideId?: number,
  imageIndex: number,
  guideType?: GuideType,
  onSwiperIndexChanged: (newIndex: number) => void,
  audioButtonDisabled: boolean,
  videoButtonDisabled: boolean,
  onGoToImage: (image: Images) => void,
  onGoToLink: (url: string, title?: string) => void,
  loadAudioFile: () => void,
  onGoToVideo: (video?: MediaContent) => void,
};

function displayID(searchableID: string) {
  const idText = (
    <View style={styles.idContainer}>
      <Text style={styles.idText}>{`ID #${searchableID}`}</Text>
    </View>
  );
  return idText;
}

function displayTitle(
  title: string,
  searchableID: string,
  guideType: ?GuideType,
) {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {guideType === "guide" ? displayID(searchableID) : null}
    </View>
  );
}

function displayText(description?: string) {
  return <Text style={styles.article}>{description}</Text>;
}

function displayLinks(
  links: Link[],
  onGoToLink: (url: string, title?: string) => void,
) {
  return links.map((item, index) => (
    <LinkTouchable
      key={item.url || index}
      title={item.title}
      onPress={() => {
        // openLink(item.url);
        Linking.openURL(item.url);
      }}
    />
  ));
}

function displayButtonsBar(
  audio?: MediaContent,
  video?: MediaContent,
  audioButtonDisabled: boolean,
  videoButtonDisabled: boolean,
  loadAudioFile: () => void,
  onGoToVideo: (video?: MediaContent) => void,
) {
  const audioBtnInvisible = !audio || !audio.url;
  const videoBtnInvisible = !video || !video.url;

  if (videoBtnInvisible && audioBtnInvisible) {
    return null;
  }

  const audioBarItem = audioBtnInvisible ? null : (
    <ButtonsBarItem
      disabled={audioButtonDisabled}
      onPress={() => {
        loadAudioFile();
      }}
      name="headphones"
      color={Colors.themeSecondary}
      size={18}
      text={LangService.strings.LISTEN}
      view="row"
    />
  );

  const videoBarItem = videoBtnInvisible ? null : (
    <ButtonsBarItem
      disabled={videoButtonDisabled}
      onPress={() => {
        onGoToVideo(video);
      }}
      name="play-box-outline"
      color={Colors.themeSecondary}
      size={18}
      text={LangService.strings.VIDEO}
      view="row"
    />
  );

  return (
    <ButtonsBar>
      {audioBarItem}
      {videoBarItem}
    </ButtonsBar>
  );
}

const guideButtons = (props) => {
  const { array, navigation, selectObject, order} = props;
  const [ width, setWidth ] = useState("");

  const onLayout=(event)=> {
    setWidth(event.nativeEvent.layout.width)
  }

  return array?.length ? <View style={styles.navGuideWrapper}>
    <Text style={styles.navGuideBarStep}>{`${(order + 1)} av ${array.length}`}</Text>
    <View style={styles.navGuide}>
    <Icon
      name={"chevron-left"}
      size={36}
      color={Colors.themeExtra1}
      style={{opacity: order > 0 ? 1 : 0.4}}
      onPress={order > 0 ? () => {
        selectObject && selectObject(array[order - 1]);
        navigation.navigate("ObjectScreen", {
          title: array[order - 1].title,
          currentGuide: array[order - 1],
          array: array,
          order: order - 1,
        })
      } : null}
    />
    <View style={styles.navGuideBarWrapper}>
      <View
        onLayout={onLayout}
        style={styles.navGuideBar}>
        {width ? <View style={[styles.navGuideBarFilled,
          {
            transform: [
              {translateX: -width + Math.round(width * ((order + 1) / array.length))}
            ] }]} />  : null }
      </View>
    </View>
    <Icon
      name={"chevron-right"}
      size={36}
      color={Colors.themeExtra1}
      style={{opacity: (order + 1) !== array.length ? 1 : 0.5}}
      onPress={(order + 1) !== array.length ? () => {
        selectObject && selectObject(array[order + 1]);
        navigation.navigate("ObjectScreen", {
          title: array[order + 1].title,
          currentGuide: array[order + 1],
          order: order + 1,
          array: array,
        })
      } : null}
    />
    </View>
  </View> : null
};

/*
 * Underlying sharingservice needs a reference to a Component instance
 */
const ObjectView = (props) => {

    const { guideId } = props;
    console.log("the props", props)
    return (
      <View style={styles.viewContainer}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View
            style={styles.imageContainer}>
            <ImageSwiper
              sessionId={guideId}
              images={props.contentObject.images}
              onSwiperIndexChanged={props.onSwiperIndexChanged}
              onGoToImage={props.onGoToImage}
            />
            {props.contentObject.images[props.imageIndex] && (
              <View style={styles.shareBtn}>
                <SharingService
                  title={props.contentObject.title}
                  image={props.contentObject.images[props.imageIndex]}
                  sender={this}
                  shareType="share_object"
                />
              </View>
            )}
          </View>

          <View style={styles.bodyContainer}>
            {displayTitle(
              props.contentObject.title,
              props.contentObject.searchableId,
              props.guideType,
            )}
            {displayButtonsBar(
              props.contentObject.audio,
              props.contentObject.video,
              props.audioButtonDisabled,
              props.videoButtonDisabled,
              props.loadAudioFile,
              props.onGoToVideo,
            )}
            <View style={styles.articleContainer}>
              {props.contentObject.description
                ? displayText(props.contentObject.description)
                : null}
              {props.contentObject.links
                ? displayLinks(
                  props.contentObject.links,
                  props.onGoToLink,
                )
                : null}
            </View>
          </View>
        </ScrollView>
        <AudioPlayerView />
      </SafeAreaView>
      <SafeAreaView>
        <View style={styles.navGuideContainer}>
          {guideButtons(props)}
        </View>
        </SafeAreaView>
      </View>
    );
}

export default ObjectView;
