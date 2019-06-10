// @flow
import React from "react";
import { View, ScrollView, TouchableOpacity, ImageBackground, Text, Modal, StatusBar } from "react-native";
import LangService from "../../../../services/langService";
import styles from "./styles";
import Illustration from "./illustration";

const numberedMarkerActive = require("../../../../images/AR/PinSelected.png");

type Props = {
  onRequestClose: () => void,
};

export default ({ onRequestClose }: Props) => (
  <Modal animationType="slide" transparent={false} visible onRequestClose={onRequestClose}>
    <StatusBar barStyle="dark-content" />
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{LangService.strings.AR_INTRO_TITLE}</Text>
        <View style={styles.illustrationImageContainer}>
          <Illustration />
          <ImageBackground source={numberedMarkerActive} style={styles.marker}>
            <Text style={styles.markerNumber}>1</Text>
          </ImageBackground>
        </View>
        <Text style={styles.instructions}>{LangService.strings.AR_INTRO_INSTRUCTIONS}</Text>
        <TouchableOpacity style={styles.startButton} onPress={onRequestClose}>
          <Text style={styles.startButtonText}>{LangService.strings.AR_INTRO_BUTTON}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </Modal>
);
