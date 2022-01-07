// @flow

import React, { Component } from "react";
import { View, Text, ScrollView, Linking } from "react-native";

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
  guideType: ?GuideType
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
  onGoToLink: (url: string, title?: string) => void
) {
  return links.map((item, index) => (
    <LinkTouchable
      key={item.url || index}
      title={item.title}
      onPress={() => {
        // openLink(item.url);
        Linking(item.url);
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
  onGoToVideo: (video?: MediaContent) => void
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

/*
 * Underlying sharingservice needs a reference to a Component instance
 */
class ObjectView extends Component<Props> {
  render() {
    const { guideId } = this.props;
    return (
      <View style={styles.viewContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.imageContainer}>
            <ImageSwiper
              sessionId={guideId}
              images={this.props.contentObject.images}
              onSwiperIndexChanged={this.props.onSwiperIndexChanged}
              onGoToImage={this.props.onGoToImage}
            />
            {this.props.contentObject.images[this.props.imageIndex] && (
              <View style={styles.shareBtn}>
                {SharingService.showShareButton(
                  this.props.contentObject.title,
                  this.props.contentObject.images[this.props.imageIndex],
                  this,
                  "share_object"
                )}
              </View>
            )}
          </View>

          <View style={styles.bodyContainer}>
            {displayTitle(
              this.props.contentObject.title,
              this.props.contentObject.searchableId,
              this.props.guideType
            )}
            {displayButtonsBar(
              this.props.contentObject.audio,
              this.props.contentObject.video,
              this.props.audioButtonDisabled,
              this.props.videoButtonDisabled,
              this.props.loadAudioFile,
              this.props.onGoToVideo
            )}
            <View style={styles.articleContainer}>
              {this.props.contentObject.description
                ? displayText(this.props.contentObject.description)
                : null}
              {this.props.contentObject.links
                ? displayLinks(
                    this.props.contentObject.links,
                    this.props.onGoToLink
                  )
                : null}
            </View>
          </View>
        </ScrollView>
        <AudioPlayerView />
      </View>
    );
  }
}

export default ObjectView;
