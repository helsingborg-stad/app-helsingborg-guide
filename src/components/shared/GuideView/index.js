// @flow

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import ExpandableView from "../ExpandableView";
import { TextStyles } from "../../../styles";
import styles from "./styles";
import ImageView from "../ImageView";

declare type Props = {
  guide: Guide,
  onPressContentObject(obj: ContentObject): void
}
const textMaxHeight = Dimensions.get("window").height * 0.2;

class GuideView extends Component<Props> {
  renderContentObject = (obj: ContentObject) => {
    const { images } = obj;
    // TODO return placeholder image
    const uri = images.length > 0 ? images[0].medium : null;
    return (
      <TouchableOpacity
        key={obj.id}
        style={styles.objectContainer}
        onPress={() => this.props.onPressContentObject(obj)}
      >
        <ImageView
          source={{ uri }}
          style={styles.objectImage}
          resizeMode="cover"
        />
        <Text style={styles.contentIdText} numberOfLines={1}>#{obj.searchableId}</Text>
        <Text style={styles.contentTitleText} numberOfLines={2}>{obj.title}</Text>
      </TouchableOpacity >
    );
  }

  renderContentObjects = (contentObjects: ContentObject[]) => (<View style={styles.objectsContainer} >
    {contentObjects.map(item => this.renderContentObject(item))}
  </View>
  )

  render() {
    const { guide } = this.props;
    return (<ScrollView style={styles.container}>
      <ImageView source={{ uri: guide.images.large }} style={styles.image} />
      <Text style={styles.title}>{guide.name}</Text>
      {guide.tagline ? <Text >{guide.tagline}</Text> : null}
      {guide.description ?
        <ExpandableView style={styles.descriptionContainer} maxHeight={textMaxHeight}>
          <Text style={TextStyles.body}>{guide.description}</Text>
        </ExpandableView> : null}
      {this.renderContentObjects(guide.contentObjects)}
    </ScrollView>);
  }
}


export default GuideView;
