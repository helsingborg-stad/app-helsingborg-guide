// @flow

import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";

import styles from "./style";
import { Colors } from "../../../styles/";
import SharingService from "../../../services/SharingService";
import ButtonsBar from "../../shared/btn_bar";
import ButtonsBarItem from "../../shared/btn_bar_item";
import ImageSwiper from "../ImageSwiper";
import LangService from "../../../services/langService";
import LinkTouchable from "../LinkTouchable";
import AudioPlayerView from "../AudioPlayerView";

type Props = {
  contentObject: ContentObject,
  imageIndex: number,
  guideType: GuideType,
  onSwiperIndexChanged: (newIndex: number) => (void),
  audioButtonDisabled: boolean,
  videoButtonDisabled: boolean,
  onGoToImage: (image: Images) => (void),
  onGoToLink: (url: string, title?: string) => (void),
  loadAudioFile: () => (void),
  onClosePlayer: () => (void),
  onTogglePlaying: () => (void),
  onSliding: (value: number) => (void),
  onSliderValueCompleted: (value: number) => (void),
}

function displayID(searchableID: string) {
  const idText = (
    <View style={styles.idContainer}>
      <Text style={styles.idText}>
        {`ID #${searchableID}`}
      </Text>
    </View>
  );
  return idText;
}

function displayTitle(title: string, searchableID: string, guideType: GuideType) {
  return (
    <View>
      <View style={styles.titleContainer} >
        <Text style={styles.title}>{title}</Text>
      </View >
      {guideType === "guide" ? displayID(searchableID) : null}
    </View >
  );
}

function displayText(description?: string) {
  return (
    <Text style={styles.article}>{description}</Text>
  );
}

function displayLinks(links: Link[], onGoToLink: (url: string, title?: string) => (void)) {
  return links.map((item, index) => (
    <LinkTouchable
      key={item.url || index}
      title={item.title}
      onPress={() => {
        onGoToLink(item.url, item.title);
      }}
    />
  ));
}


function displayButtonsBar(audio?: MediaContent,
  video?: MediaContent,
  audioButtonDisabled: boolean,
  videoButtonDisabled: boolean,
  loadAudioFile: () => (void)) {
  const audioBtnInvisible = !audio || !audio.url;
  const videoBtnInvisible = !video || !video.url;

  if (videoBtnInvisible && audioBtnInvisible) { return null; }

  const audioBarItem = audioBtnInvisible ? null : (
    <ButtonsBarItem
      disabled={audioButtonDisabled}
      onPress={() => { loadAudioFile(); }}
      name="headphones"
      color={Colors.darkPurple}
      size={18}
      text={LangService.strings.LISTEN}
      view="row"
    />
  );

  const videoBarItem = null;
  //  console.log(videoButtonDisabled);

  /* const videoBarItem = videoBtnInvisible ? null : (
    <ButtonsBarItem
      disabled={videoButtonDisabled}
      onPress={() => {
        this._goToVideoView(video, this.state.guideID);
      }}
      name="play-box-outline"
      color={Colors.darkPurple}
      size={18}
      text={LangService.strings.VIDEO}
      view="row"
    />
  );
  */

  return (
    <ButtonsBar>
      {audioBarItem}
      {videoBarItem}
    </ButtonsBar>
  );
}


/*
* Underlying sharingservice needs a reference to a Component instance
*/
// eslint-disable-next-line react/prefer-stateless-function
class ObjectView extends Component<Props> {
  render() {
    return (

      <View style={styles.viewContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            <ImageSwiper
              images={this.props.contentObject.images}
              onSwiperIndexChanged={this.props.onSwiperIndexChanged}
              onGoToImage={this.props.onGoToImage}
            />
            <View style={styles.shareBtn}>
              {SharingService.showShareButton(this.props.contentObject.title, this.props.contentObject.images[this.props.imageIndex], this)}
            </View>
          </View>

          <View style={styles.bodyContainer}>

            {displayTitle(this.props.contentObject.title, this.props.contentObject.searchableId, this.props.guideType)}
            {displayButtonsBar(this.props.contentObject.audio,
              this.props.contentObject.video,
              this.props.audioButtonDisabled,
              this.props.videoButtonDisabled,
              this.props.loadAudioFile)}
            <View style={styles.articleContainer}>
              {this.props.contentObject.description ? displayText(this.props.contentObject.description) : null}
              {this.props.contentObject.links ? displayLinks(this.props.contentObject.links, this.props.onGoToLink) : null}
            </View>
          </View>
        </ScrollView>
        <AudioPlayerView
          onClosePlayer={this.props.onClosePlayer}
          onTogglePlaying={this.props.onTogglePlaying}
          onSlidingCallback={this.props.onSliding}
          onSliderValueCompletedCallback={this.props.onSliderValueCompleted}
        />

      </View>

    );
  }
}

export default ObjectView;
