// @flow

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import ExpandableView from "../ExpandableView";
import { TextStyles } from "../../../styles";
import styles from "./styles";
import ImageView from "../ImageView";
import DateView from "../DateView";
import AudioPlayerView from "../AudioPlayerView";
import DownloadButtonContainer from "../DownloadButton";
import SharingService from "../../../services/SharingService";

declare type Props = {
  guide: Guide,
  onPressContentObject(obj: ContentObject): void
};

const textMaxHeight = Dimensions.get("window").height * 0.2;

class GuideView extends Component<Props> {
  renderContentObject = (sessionId: number, obj: ContentObject) => {
    const { images } = obj;
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <TouchableOpacity
        key={obj.id}
        style={styles.objectContainer}
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
    );
  };

  renderContentObjects = (
    sessionId: number,
    contentObjects: ContentObject[],
  ) => (
    <View style={styles.objectsContainer}>
      {contentObjects.map(item => this.renderContentObject(sessionId, item))}
    </View>
  );

  render() {
    const { guide } = this.props;
    const { id } = guide;
    return (
      <View style={styles.viewContainer}>
        <ScrollView style={styles.container}>
          <View>
            <ImageView
              source={{ uri: guide.images.large, sessionId: id }}
              style={styles.image}
            />
            <View style={styles.shareBtn}>
              {SharingService.showShareButton(guide.name, guide.images, this)}
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
