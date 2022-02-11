// @flow
import React from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StatusBar
} from "react-native";
import LangService from "@services/langService";
import InstructionIllustration from "@shared-components/InstructionIllustration";
import { AnalyticsUtils } from "@utils";
import styles from "./styles";

const numberedMarkerActive = require("@assets/images/PinArrived_2D.png");

type Props = {
  navigation: Object
};

export default ({ navigation }: Props) => (
  <View style={styles.outerContainer}>
    <StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{LangService.strings.AR_INTRO_TITLE}</Text>
        <Text style={styles.instructions}>
          {LangService.strings.AR_INTRO_INSTRUCTIONS}
        </Text>
        <InstructionIllustration
          speechBubbleText={LangService.strings.BETA_VERSION.toUpperCase()}
          instructionText={LangService.strings.AR_INTRO_BETA_BADGE}
          image={numberedMarkerActive}
        />
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            AnalyticsUtils.logEvent("tap_start_ar_button");
            navigation.pop();
            navigation.state.params.onRequestClose();
          }}
        >
          <Text style={styles.startButtonText}>
            {LangService.strings.AR_INTRO_BUTTON}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);
