// @flow

import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Linking } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";

import styles from "./style";
import { Colors } from "@assets/styles";
import SharingService from "@services/SharingService";
import ButtonsBar from "@shared-components/btn_bar";
import ButtonsBarItem from "@shared-components/btn_bar_item";
import ImageSwiper from "@shared-components/ImageSwiper";
import LangService from "@services/langService";
import LinkTouchable from "@shared-components/LinkTouchable";
import AudioPlayerView from "@shared-components/AudioPlayerView";
import { trackScreen } from "@utils/MatomoUtils";


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
    <View style={styles.titleWrapper}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {/*{guideType === "guide" ? displayID(searchableID) : null}*/}
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
        Linking.openURL(item.url);
      }}
    />
  ));
}

function displayButtons(
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
      name="play"
      color={Colors.white}
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
      color={Colors.white}
      size={18}
      text={LangService.strings.VIDEO}
      view="row"
    />
  );

  return (
    <ButtonsBar>
      {!videoBarItem && audioBarItem}
      {videoBarItem}
    </ButtonsBar>
  );
}

const guideButtons = (props) => {
  const { array, navigation, selectObject, order, scrollable, panToIndex, path } = props;
  const [width, setWidth] = useState("");
  const split = path.split("/");


  const onLayout = (event) => {
    setWidth(event.nativeEvent.layout.width);
  };
  return array?.length ? <View style={styles.navGuideWrapper}>
    <Text style={styles.navGuideBarStep}>{`${(order + 1)} av ${array.length}`}</Text>
    <View style={styles.navGuide}>
      <Icon
        name={"chevron-left"}
        size={36}
        color={Colors.themeExtra1}
        style={{ opacity: order > 0 ? 1 : 0.4 }}
        onPress={order > 0 ? () => {
          let newPath = split.slice(0, split.length - 1).join("/") + `/${array[order - 1].title}`;
          trackScreen(newPath, newPath);
          scrollable && scrollable(order - 1);
          selectObject && selectObject(array[order - 1]);
          panToIndex && panToIndex(order - 1);
          navigation.navigate("ObjectScreen", {
            title: array[order - 1].title,
            currentGuide: array[order - 1],
            array: array,
            order: order - 1,
            swipeable: true,
            path: newPath
          });
        } : null}
      />
      <View style={styles.navGuideBarWrapper}>
        <View
          onLayout={onLayout}
          style={styles.navGuideBar}>
          {width ? <View style={[styles.navGuideBarFilled,
            {
              transform: [
                { translateX: -width + Math.round(width * ((order + 1) / array.length)) }
              ]
            }]} /> : null}
        </View>
      </View>
      <Icon
        name={"chevron-right"}
        size={36}
        color={Colors.themeExtra1}
        style={{ opacity: (order + 1) !== array.length ? 1 : 0.5 }}
        onPress={(order + 1) !== array.length ? () => {
          let newPath = split.slice(0, split.length - 1).join("/") + `/${array[order + 1].title}`;
          trackScreen(newPath, newPath);
          scrollable && scrollable(order + 1);
          selectObject && selectObject(array[order + 1]);
          panToIndex && panToIndex(order + 1);
          navigation.navigate("ObjectScreen", {
            title: array[order + 1].title,
            currentGuide: array[order + 1],
            order: order + 1,
            array: array,
            swipeable: true,
            path: newPath
          });
        } : null}
      />
    </View>
  </View> : null;
};


const onHorizontalSwipe = (evt, swiped, setSwiped) => {
  const { nativeEvent } = evt;
  if (!swiped) {
    if (nativeEvent.velocityX > 220) {
      setSwiped("right");
    }
    if (nativeEvent.velocityX < -220) {
      setSwiped("left");
    }
  }
};


/*
 * Underlying sharingservice needs a reference to a Component instance
 */
const ObjectView = (props: Props) => {
  const {
    guideId,
    swipeable,
    scrollable,
    panToIndex,
    selectObject,
    navigation,
    array,
    order,
    onSwiperIndexChanged,
    path
  } = props;
  const [swiped, setSwiped] = useState(false);
  const ref = React.createRef();

  useEffect(() => {
    setTimeout(() => setSwiped(false), 180);
  }, [props]);


  useEffect(() => {
    const split = path.split("/");

    if (swiped) {
      if (swiped === "left") {
        if ((order + 1) !== array.length) {
          let newPath = split.slice(0, split.length - 1).join("/") + `/${array[order + 1].title}`;
          trackScreen(newPath, newPath);
          scrollable && scrollable(order + 1);
          selectObject && selectObject(array[order + 1]);
          panToIndex && panToIndex(order + 1);
          navigation.navigate("ObjectScreen", {
            title: array[order + 1].title,
            currentGuide: array[order + 1],
            order: order + 1,
            array: array,
            swipeable: true
          });
        } else {
          setTimeout(() => setSwiped(false), 180);
        }
      }
      if (swiped === "right") {
        if (order > 0) {
          let newPath = split.slice(0, split.length - 1).join("/") + `/${array[order - 1].title}`;
          trackScreen(newPath, newPath);
          scrollable && scrollable(order - 1);
          selectObject && selectObject(array[order - 1]);
          panToIndex && panToIndex(order - 1);
          navigation.navigate("ObjectScreen", {
            title: array[order - 1].title,
            currentGuide: array[order - 1],
            array: array,
            order: order - 1,
            swipeable: true
          });
        } else {
          setTimeout(() => setSwiped(false), 180);
        }
      }
    }
  }, [swiped]);

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
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
          <PanGestureHandler
            activeOffsetX={[-10, 10]}
            onGestureEvent={(e) => swipeable ? onHorizontalSwipe(e, swiped, setSwiped) : null}>
            <View style={styles.bodyContainer}>
              <View style={styles.infoContainer}>
                {displayTitle(
                  props.contentObject.title,
                  props.contentObject.searchableId,
                  props.guideType
                )}
                {displayButtons(
                  props.contentObject.audio,
                  props.contentObject.video,
                  props.audioButtonDisabled,
                  props.videoButtonDisabled,
                  props.loadAudioFile,
                  props.onGoToVideo
                )}
              </View>
              <View style={styles.articleContainer}>
                {props.contentObject.description
                  ? displayText(props.contentObject.description)
                  : null}
                {props.contentObject.links
                  ? displayLinks(
                    props.contentObject.links,
                    props.onGoToLink
                  )
                  : null}
              </View>
            </View>
          </PanGestureHandler>
        </ScrollView>
        <AudioPlayerView />
      </SafeAreaView>
      <SafeAreaView>
        <View style={styles.navGuideContainer}>
          {guideButtons(props)}
        </View>
      </SafeAreaView>
    </View>
    // <SwipeableObject {...newProps}>
    // </SwipeableObject>
  );
};

export default ObjectView;
