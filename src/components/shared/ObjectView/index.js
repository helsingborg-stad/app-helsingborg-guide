// @flow

import React, { Component } from "react";
import { View, Text, Dimensions, ScrollView, TouchableWithoutFeedback } from "react-native";
import Swiper from "react-native-swiper";
import ImageView from "../ImageView";
import styles from "./style";
import SharingService from "../../../services/SharingService";
import LinkTouchable from "../LinkTouchable";

const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.32;

type Props = {
  contentObject: ContentObject,
  imageIndex: number,
  guideType: GuideType,
  onSwiperIndexChanged: (newIndex: number) => (void),
  onGoToImage: (image: Images) => (void),
  onGoToLink: (url: string, title?: string) => (void)
}

function displayImagesSlider(
  images: Images[],
  onSwiperIndexChanged: (newIndex: number) => (void),
  onGoToImage: (image: Images) => (void)) {
  const slides = images.map((image, index) => (
    <View key={image.thumbnail || index}>
      <TouchableWithoutFeedback onPress={() => onGoToImage(image)}>
        <View>
          <ImageView source={{ uri: image.large }} style={styles.image} resizeMode="cover" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  ));

  return (
    <Swiper
      style={styles.imagesSlider}
      height={MAX_IMAGE_HEIGHT}
      dotColor="white"
      activeDotColor="#D35098"
      showsButtons={false}
      loop={false}
      onIndexChanged={onSwiperIndexChanged}
    >
      {slides}
    </Swiper>
  );
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


class ObjectView extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  render() {
    return (

      <View style={styles.viewContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View>
            {displayImagesSlider(this.props.contentObject.images, this.props.onSwiperIndexChanged, this.props.onGoToImage)}
            <View style={styles.shareBtn}>
              {SharingService.showShareButton(this.props.contentObject.title, this.props.contentObject.images[this.props.imageIndex], this)}
            </View>
          </View>
          <View style={styles.bodyContainer}>
            {displayTitle(this.props.contentObject.title, this.props.contentObject.searchableId, this.props.guideType)}
            {/* this.displayButtonsBar() audio/video */}
            <View style={styles.articleContainer}>
              {this.props.contentObject.description ? displayText(this.props.contentObject.description) : null}
              {this.props.contentObject.links ? displayLinks(this.props.contentObject.links, this.props.onGoToLink) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ObjectView;
