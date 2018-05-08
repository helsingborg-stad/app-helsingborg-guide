// @flow

import React, { Component } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

declare type Props = {
  guide: Guide,
  onPressContentObject(guide: Guide, obj: ContentObject): void
}

class GuideView extends Component<Props> {
  renderContentObject = (obj: ContentObject) => {
    const { images } = obj;
    const { guide } = this.props;
    // TODO return placeholder image
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <TouchableOpacity
        key={obj.id}
        style={styles.objectContainer}
        onPress={() => this.props.onPressContentObject(guide, obj)}
      >
        <Image
          source={{ uri }}
          style={styles.objectImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  renderContentObjects = (contentObjects: ContentObject[]) => (<View style={styles.objectsContainer} >
    {contentObjects.map(item => this.renderContentObject(item))}
  </View>
  )

  render() {
    const { guide } = this.props;
    return (<ScrollView style={styles.container}>
      <Image source={{ uri: guide.images.large }} style={styles.image} />
      <Text>{guide.name}</Text>
      {this.renderContentObjects(guide.contentObjects)}
    </ScrollView>);
  }
}


export default GuideView;
