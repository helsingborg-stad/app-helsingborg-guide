// @flow

import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import styles from "./styles";

declare type Props = {
  guide: Guide
}

const GuideView = (props: Props) => {
  const { guide } = props;
  return (<ScrollView style={styles.container}>
    <Image source={{ uri: guide.images.large }} style={styles.image} />
    <Text>{guide.name}</Text>
  </ScrollView>);
};


export default GuideView;
