// @flow
import React from "react";
import { ScrollView, View, TouchableOpacity, Text, Modal, StatusBar } from "react-native";
import LangService from "../../../../services/langService";
import InstructionIllustration from "../../InstructionIllustration";
import styles from "./styles";

const numberedMarkerActive = require("../../../../images/PinArrived_2D.png");

type Props = {
  onRequestClose: () => void,
};

export default ({ onRequestClose }: Props) => (
  <Modal animationType="slide" transparent={false} visible onRequestClose={onRequestClose}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.outerContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{LangService.strings.AR_INTRO_TITLE}</Text>
          <Text style={styles.instructions}>{LangService.strings.AR_INTRO_INSTRUCTIONS}</Text>
          <InstructionIllustration
            speechBubbleText={LangService.strings.BETA_VERSION.toUpperCase()}
            instructionText={LangService.strings.AR_INTRO_BETA_BADGE}
            image={numberedMarkerActive}
          />
          <TouchableOpacity style={styles.startButton} onPress={onRequestClose}>
            <Text style={styles.startButtonText}>{LangService.strings.AR_INTRO_BUTTON}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  </Modal>
);
