// @flow
import React from "react";
import { View, TouchableOpacity, ImageBackground, Image, Text, Modal, StatusBar } from "react-native";
import LangService from "../../../../services/langService";
import styles from "./styles";
import Illustration from "./illustration";

const numberedMarkerActive = require("../../../../images/AR/PinArrived.png");
const speechBubble = require("../../../../images/SpeechBubble.png");

type Props = {
  onRequestClose: () => void,
};

export default ({ onRequestClose }: Props) => (
  <Modal animationType="slide" transparent={false} visible onRequestClose={onRequestClose}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.container}>
      <Text style={styles.title}>{LangService.strings.AR_INTRO_TITLE}</Text>
      <View style={styles.illustrationImageContainer}>
        <ImageBackground source={speechBubble} style={styles.speechBubble}>
          <Text style={styles.speechBubbleText}>{LangService.strings.BETA_VERSION.toUpperCase()}</Text>
        </ImageBackground>
        <View style={styles.mobileHandContainer}>
          <Illustration />
          <Image source={numberedMarkerActive} style={styles.marker} />
        </View>
      </View>
      <Text style={styles.instructions}>{LangService.strings.AR_INTRO_INSTRUCTIONS}</Text>
      <TouchableOpacity style={styles.startButton} onPress={onRequestClose}>
        <Text style={styles.startButtonText}>{LangService.strings.AR_INTRO_BUTTON}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);
