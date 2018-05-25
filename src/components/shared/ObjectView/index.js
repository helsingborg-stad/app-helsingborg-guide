// @flow

import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";

import styles from "./style";
import SharingService from "../../../services/SharingService";
import ImageSwiper from "../ImageSwiper";
import LinkTouchable from "../LinkTouchable";

type Props = {
  contentObject: ContentObject,
  guideId?: number,
  imageIndex: number,
  guideType: GuideType,
  onSwiperIndexChanged: (newIndex: number) => (void),
  onGoToImage: (image: Images) => (void),
  onGoToLink: (url: string, title?: string) => (void)
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


/*
* Underlying sharingservice needs a reference to a Component instance
*/
// eslint-disable-next-line react/prefer-stateless-function
class ObjectView extends Component<Props> {
  render() {
    const { guideId } = this.props;
    return (
      <View style={styles.viewContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.imageContainer}>
            <ImageSwiper
              sessionId={guideId}
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
