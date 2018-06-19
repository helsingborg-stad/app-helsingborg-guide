// @flow

import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import Swiper from "react-native-swiper";
import ImageView from "../ImageView";
import styles from "./style";
import Colors from "../../../styles/Colors";

function getImageSwiper(
  images: Images[],
  onSwiperIndexChanged: (newIndex: number) => (void),
  onGoToImage: (image: Images) => (void),
  sessionId?: number) {
  const slides = images.map((image, index) => (
    <View key={image.thumbnail || index}>
      <TouchableWithoutFeedback onPress={() => onGoToImage(image)}>
        <View>
          <ImageView source={{ uri: image.large, sessionId }} style={styles.image} resizeMode="cover" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  ));

  return (
    <Swiper
      style={styles.imagesSlider}
      dotColor={Colors.white}
      activeDotColor={Colors.lightPink}
      showsButtons={false}
      loop={false}
      onIndexChanged={onSwiperIndexChanged}
    >
      {slides}
    </Swiper>
  );
}

type Props = {
  images: Images[],
  sessionId?: number,
  onSwiperIndexChanged: (newIndex: number) => (void),
  onGoToImage: (image: Images) => (void)
}

export default function ImageSwiper(props: Props) {
  return getImageSwiper(props.images, props.onSwiperIndexChanged, props.onGoToImage, props.sessionId);
}
