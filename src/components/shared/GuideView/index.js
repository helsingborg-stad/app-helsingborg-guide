// @flow

import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import styles from "./styles";

declare type Props = {
  guide: Guide
}

function renderContentObject(obj: any) {
  // TODO use ContentObject type
  const images: Images[] = obj.images;
  // TODO return placeholder image
  const uri = images.length > 0 ? images[0].medium : null;
  return (
    <View key={obj.id} style={styles.objectContainer}>
      <Image
        source={{ uri }}
        style={styles.objectImage}
        resizeMode="cover"
      />
    </View>
  );
}

function renderContentObjects(contentObjects: any[]) {
  // TODO use ContentObject type
  return (<View style={styles.objectsContainer} >
    {contentObjects.map(item => renderContentObject(item))}
  </View>
  );
}

const GuideView = (props: Props) => {
  const { guide } = props;
  return (<ScrollView style={styles.container}>
    <Image source={{ uri: guide.images.large }} style={styles.image} />
    <Text>{guide.name}</Text>
    {renderContentObjects(guide.contentObjects)}
  </ScrollView>);
};


export default GuideView;
