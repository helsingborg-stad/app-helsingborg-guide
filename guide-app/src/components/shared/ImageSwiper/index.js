// @flow

import React, { useState, useEffect, useRef } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import Swiper from "react-native-swiper";
import ImageView from "@shared-components/ImageView";
import styles from "./style";
import Colors from "@assets/styles/Colors";

function getImageSwiper(
  images: Images[],
  onSwiperIndexChanged: (newIndex: number) => void,
  onGoToImage: (image: Images) => void,
  sessionId?: number,
) {

  const swiper = useRef(null)
  const [index, setIndex] = useState(0);

  // Reseting to first image when a different set of images are rendered.

  useEffect(() => {
    if(images.length) {
      const difference = 0 - index;
      swiper?.current && swiper?.current?.scrollBy(difference);
    }
  },[images])

  const slides = images.map((image, index) => (
    <View key={image.thumbnail || index}>
      <TouchableWithoutFeedback onPress={() => onGoToImage(image)}>
        <View>
          <ImageView
            source={{ uri: image.large, sessionId }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  ));

  return (
    <Swiper
      ref={swiper}
      style={styles.imagesSlider}
      dotColor={Colors.white}
      activeDotColor={Colors.themeControl}
      showsButtons={false}
      loop={false}
      onIndexChanged={(index) => {
        onSwiperIndexChanged(index);
        setIndex(index);
      }}
    >
      {slides}
    </Swiper>
  );
}

type Props = {
  images: Images[],
  sessionId?: number,
  onSwiperIndexChanged: (newIndex: number) => void,
  onGoToImage: (image: Images) => void
};

export default function ImageSwiper(props: Props) {
  return getImageSwiper(
    props.images,
    props.onSwiperIndexChanged,
    props.onGoToImage,
    props.sessionId
  );
}
