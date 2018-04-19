// @flow

import React from "react";
import { View, Text, ScrollView } from "react-native";
import ImageView from "../image_view";
import styles from "./style";

type Props = {
  guideGroup: GuideGroup
}

const LocationView = (props: Props) => (
  <View style={styles.viewContainer} >
    <ScrollView style={styles.scrollView}>
      <View style={styles.imageViewContainer}>
        <ImageView source={{ uri: props.guideGroup.images.large }} />
      </View>
      <Text> Hej </Text>
    </ScrollView>
  </View>
);

export default LocationView;
