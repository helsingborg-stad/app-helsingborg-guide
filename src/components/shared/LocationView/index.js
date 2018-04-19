// @flow

import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import styles from "./style";

type Props = {
  guideGroup: GuideGroup,
  comingSoonText: string
}

function displayComingSoon(comingSoonText: string) {
  return (
    <View style={styles.comingSoonView}>
      <Text style={styles.comingSoonText}>{comingSoonText}</Text>
    </View>
  );
}

const LocationView = (props: Props) => (
  <View style={styles.viewContainer} >
    <ScrollView style={styles.scrollView}>
      <View style={styles.imageViewContainer}>
        <ImageBackground
          source={{ uri: props.guideGroup.images.large }}
          style={styles.imageBackground}
        >
          {!props.guideGroup.active ? displayComingSoon(props.comingSoonText) : null}
        </ImageBackground>
      </View>
      <Text> Hej </Text>
    </ScrollView>
  </View>
);

export default LocationView;
