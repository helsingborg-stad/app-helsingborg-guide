// @flow
import React from "react";
import { View, ImageBackground, Image, Text } from "react-native";
import styles from "./styles";
import Illustration from "./illustration";

const speechBubble = require("@assets/images/SpeechBubble.png");

type Props = {
  speechBubbleText: string,
  instructionText: string,
  image: any
};

export default ({ speechBubbleText, instructionText, image }: Props) => (
  <View style={styles.container}>
    <View style={styles.illustrationImageContainer}>
      <ImageBackground source={speechBubble} style={styles.speechBubble}>
        <Text style={styles.speechBubbleText}>{speechBubbleText}</Text>
      </ImageBackground>
      <View style={styles.mobileHandContainer}>
        <Illustration />
        <Image source={image} style={styles.marker} />
      </View>
    </View>
    <Text style={styles.instructions}>{instructionText}</Text>
  </View>
);
