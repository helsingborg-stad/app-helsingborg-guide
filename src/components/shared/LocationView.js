// @flow

import React from "react";
import { View, Text, ScrollView } from "react-native";
import ImageView from "./image_view";
import styles from "./LocationView.style";

type Props = {
  guideGroup: GuideGroup
}

function display(guideGroup: GuideGroup) {
  return (
    <View style={styles.viewContainer} >
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageViewContainer}>
          <ImageView source={{ uri: guideGroup.images.large }} />
        </View>
        <Text> Hej </Text>
      </ScrollView>
    </View>
  );
}

export default function LocationView(props: Props) {
  return display(props.guideGroup);
}
