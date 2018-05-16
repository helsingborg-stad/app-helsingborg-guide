// @flow

import React from "react";
import { View, TouchableWithoutFeedback, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import ImageView from "../ImageView";
import styles from "./style";

const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.32; // och vad med denna.

function getImageSwiper(
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

type Props = {
  images: Images[],
  onSwiperIndexChanged: (newIndex: number) => (void),
  onGoToImage: (image: Images) => (void)
}

export default function ImageSwiper(props: Props) {
  return getImageSwiper(props.images, props.onSwiperIndexChanged, props.onGoToImage);
}
