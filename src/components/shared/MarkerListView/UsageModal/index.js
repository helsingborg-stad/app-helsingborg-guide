// @flow
import React from "react";
import { View, TouchableOpacity, Image, Text, Modal } from "react-native";
import LangService from "../../../../services/langService";
import styles from "./styles";

export default ({ onRequestClose }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible
    onRequestClose={onRequestClose}
  >
    <View style={styles.container}>
      <Text style={styles.title}>{LangService.strings.AR_INTRO_TITLE}</Text>
      <View style={styles.exampleImageContainer}>
        <Image style={styles.exampleImage} />
      </View>
      <Text style={styles.instructions}>{LangService.strings.AR_INTRO_INSTRUCTIONS}</Text>
      <TouchableOpacity style={styles.startButton} onPress={onRequestClose}>
        <Text style={styles.startButtonText}>{LangService.strings.AR_INTRO_BUTTON}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);
