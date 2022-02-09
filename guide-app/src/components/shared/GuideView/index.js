// @flow

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import ExpandableView from "@shared-components/ExpandableView";
import { Colors, TextStyles } from "@assets/styles";
import styles from "./styles";
import ImageView from "@shared-components/ImageView";
import DateView from "@shared-components/DateView";
import AudioPlayerView from "@shared-components/AudioPlayerView";
import Touchable from "@shared-components/Touchable";
import DownloadButtonContainer from "@shared-components/DownloadButton";
import SharingService from "@services/SharingService";


declare type Props = {
  guide: Guide,
  onPressContentObject(obj: ContentObject): void,
};

const textMaxHeight = Dimensions.get("window").height * 0.2;

class GuideView extends Component<Props> {
  renderContentObject = (sessionId: number, obj: ContentObject, index, array ) => {
    const { images } = obj;
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <View key={obj.id} style={styles.objectContainer}>
        <Touchable
          style={styles.objectButtonContainer}
          onPress={() => this.props.onPressContentObject(obj, index, array)}
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
        </Touchable>
      </View>
    );
  };

  renderContentObjects = (
    sessionId: number,
    contentObjects: ContentObject[]
  ) => (
    <View style={styles.objectsContainer}>
      {contentObjects.map((item, index) => this.renderContentObject(
        sessionId,
        item,
        index,
        contentObjects
        ))}
    </View>
  );

  render() {
    const { guide } = this.props;
    const { id } = guide;
    return (
      <View style={styles.viewContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View>
            <ImageView
              source={{ uri: guide.images.large, sessionId: id }}
              style={styles.image}
            />
            <View style={styles.shareBtn}>
              <SharingService
                title={guide.name}
                image={guide.images}
                sender={this}
                shareType="share_object"
              />
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
