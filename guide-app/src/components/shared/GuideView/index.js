// @flow

import React from "react";
import { Text, View, Dimensions, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchNavigation } from "@actions/navigationActions";
import ExpandableView from "@shared-components/ExpandableView";
import Scrollable from "@shared-components/Scrollable";
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
const textMaxHeight = Dimensions.get("window").height * 0.15;

const GuideView = (props: Props) => {
  const { guide, onPressContentObject, disableShare } = props;
  const { id } = guide;
  const dispatch = useDispatch();
  const { currentLanguage } = useSelector((s) => s.navigation);

  const renderContentObject = (
    sessionId: number,
    obj: ContentObject,
    index,
    array
  ) => {
    const { images } = obj;
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <View key={obj.id} style={styles.objectContainer}>
        <Touchable
          style={styles.objectButtonContainer}
          onPress={() => onPressContentObject(obj, index, array)}
        >
          <View style={styles.objectImageWrapper}>
            <ImageView
              source={{ uri }}
              style={styles.objectImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.contentTitleText} numberOfLines={2}>
            {obj.title}
          </Text>
        </Touchable>
      </View>
    );
  };

  const renderContentObjects = (
    sessionId: number,
    contentObjects: ContentObject[]
  ) => (
    <View style={styles.objectsContainer}>
      {contentObjects.map((item, index) =>
        renderContentObject(sessionId, item, index, contentObjects)
      )}
    </View>
  );

  return (
    <View style={styles.viewContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      <Scrollable
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={true}
        refreshAction={() => dispatch(fetchNavigation(currentLanguage))}
      >
        <View>
          <ImageView
            source={{ uri: guide.images.large }}
            style={styles.image}
          />
          <View style={styles.shareBtn}>
            {!disableShare && (
              <SharingService
                title={guide.name}
                image={guide.images}
                sender={""}
                shareType="share_object"
              />
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
          {guide.description ? (
            <ExpandableView maxHeight={textMaxHeight}>
              <Text style={TextStyles.body}>{guide.description}</Text>
            </ExpandableView>
          ) : null}
        </View>
        {renderContentObjects(id, guide.contentObjects)}
      </Scrollable>
      <AudioPlayerView />
    </View>
  );
};

export default GuideView;
