// @flow

import React, { Component } from "react";
import {
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar
} from "react-native";
import ExpandableView from "@shared-components/ExpandableView";
import { Colors, TextStyles } from "@assets/styles";
import styles from "./styles";
import ImageView from "@shared-components/ImageView";
import DateView from "@shared-components/DateView";
import AudioPlayerView from "@shared-components/AudioPlayerView";
import DownloadButtonContainer from "@shared-components/DownloadButton";
import SharingService from "@services/SharingService";

declare type Props = {
  guide: Guide,
  onPressContentObject(obj: ContentObject): void,
  onPressQuiz: (quiz: Quiz) => void
};

const textMaxHeight = Dimensions.get("window").height * 0.2;

class GuideView extends Component<Props> {
  renderContentObject = (sessionId: number, obj: ContentObject) => {
    const { images } = obj;
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <View key={obj.id} style={styles.objectContainer}>
        <TouchableOpacity
          style={styles.objectButtonContainer}
          onPress={() => this.props.onPressContentObject(obj)}
        >
          <ImageView
            source={{ uri, sessionId }}
            style={styles.objectImage}
            resizeMode="cover"
          />
          <Text style={styles.contentIdText} numberOfLines={1}>
            #{obj.searchableId}
          </Text>
          <Text style={styles.contentTitleText} numberOfLines={2}>
            {obj.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderContentObjects = (
    sessionId: number,
    contentObjects: ContentObject[]
  ) => (
      <View style={styles.objectsContainer}>
        {contentObjects.map(item => this.renderContentObject(sessionId, item))}
      </View>
    );

  render() {
    const { guide, onPressQuiz } = this.props;
    const { id, quiz } = guide;
    return (
      <View style={styles.viewContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <ScrollView style={styles.container}>
          <View>
            <ImageView
              source={{ uri: guide.images.large, sessionId: id }}
              style={styles.image}
            />
            <View style={styles.shareBtn}>
              {SharingService.showShareButton(
                guide.name,
                guide.images,
                this,
                "share_guide"
              )}
            </View>
          </View>
          <DownloadButtonContainer style={styles.downloadButton} />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {guide.name}
            </Text>
            <View style={styles.optionalTexts}>
              {guide.tagline ? (
                <Text style={styles.guideTaglineText}>{guide.tagline}</Text>
              ) : null}
              <DateView startDate={guide.dateStart} endDate={guide.dateEnd} />
            </View>
            {quiz && (
              <Button onPress={() => onPressQuiz(quiz)} title={quiz.name} />
            )}
            {guide.description ? (
              <ExpandableView maxHeight={textMaxHeight}>
                <Text style={TextStyles.body}>{guide.description}</Text>
              </ExpandableView>
            ) : null}
          </View>
          {this.renderContentObjects(id, guide.contentObjects)}
        </ScrollView>
        <AudioPlayerView />
      </View>
    );
  }
}

export default GuideView;
