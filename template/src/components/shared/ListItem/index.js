// @flow

import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LangService from "@services/langService";
import ImageView from "@shared-components/ImageView";
import DateView from "@shared-components/DateView";
import styles from "./style";
import { Colors } from "@assets/styles";

function forKidsView() {
  return (
    <View style={styles.checkedContainer}>
      <Icon name="face" size={20} color={Colors.gray2} />
      <Text style={styles.forKidsText}>{LangService.strings.FOR_CHILDREN}</Text>
    </View>
  );
}

function displayImage(imageSource: Object) {
  return (
    <ImageView
      style={styles.imageContainer}
      source={imageSource}
      resizeMode="cover"
      /* guideID={id} */ // TODO: offline support
    />
  );
}

type Props = {
  forKids: boolean,
  title: string,
  description?: ?string,
  startDate?: string,
  endDate?: string,
  imageSource: Object
  // id: number // TODO: we will need id later for offline lookup
};

const ListItem = (props: Props) => (
  <View>
    <View>{displayImage(props.imageSource)}</View>
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {props.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {props.description}
        </Text>
        <DateView startDate={props.startDate} endDate={props.endDate} />
        {props.forKids ? forKidsView() : null}
      </View>
    </View>
  </View>
);

ListItem.defaultProps = {
  startDate: "",
  endDate: "",
  description: ""
};

export default ListItem;
