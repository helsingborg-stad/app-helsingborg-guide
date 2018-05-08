// @flow

import React from "react";
import { View, Text, Image, Dimensions, ScrollView, TouchableWithoutFeedback } from "react-native";
import Swiper from "react-native-swiper";
import styles from "./style";

const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.32;

type Props = {
  contentObject: ContentObject,
  guideType: GuideType,
  navigation: any
}

function goToImageView(image, /* guideID, */ navigation: any) {
  const { navigate } = navigation;
  navigate("ImageScreen", { image/* , guideID */ });
}

function displayImagesSlider(images: Images[], navigation: any) {
  const slides = images.map((image, index) => (
    <View key={image.thumbnail || index}>
      <TouchableWithoutFeedback onPress={() => goToImageView(image/* , this.state.guideID offline stuff */, navigation)}>
        <View>
          <Image source={{ uri: image.large }} style={styles.image} resizeMode="cover" />
          {/* guideID={this.state.guideID} */}
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
    /* onIndexChanged={this.swiperIndexChanged} */ /* MOVE TO REDUX */
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
    <View style={styles.articleContainer}>
      <Text style={styles.article}>{description}</Text>
    </View>
  );
}

const ObjectView = (props: Props) => (
  <View style={styles.viewContainer}>
    <ScrollView contentContainerStyle={styles.scrollView}>
      {displayImagesSlider(props.contentObject.images, props.navigation)}
      <View style={styles.bodyContainer}>
        {displayTitle(props.contentObject.title, props.contentObject.searchableId, props.guideType)}
        {/* this.displayButtonsBar() */}
        {props.contentObject.description ? displayText(props.contentObject.description) : null}
        {/* <View style={styles.articleContainer}>{this.displayLinks()}</View> */}
      </View>
    </ScrollView>
  </View>

);

ObjectView.defaultProps = {
};

export default ObjectView;
