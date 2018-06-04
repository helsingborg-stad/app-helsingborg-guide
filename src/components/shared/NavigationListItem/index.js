
// @flow
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LangService from "../../../services/langService";
import styles from "./styles";

type Props = {
  item: RenderableNavigationItem,
  onPressItem(item: RenderableNavigationItem): void
};

function renderGuideCount(item: RenderableNavigationItem) {
  const { guidesCount, type } = item;
  if (!guidesCount) return null;

  const plural = guidesCount > 1;

  let textString = null;
  if (type === "guidegroup") {
    const mediaGuideString: string = plural ? LangService.strings.MEDIAGUIDES : LangService.strings.MEDIAGUIDE;
    textString = `${guidesCount} ${mediaGuideString.toUpperCase()}`;
  } else if (type === "trail") {
    const locationString: string = plural ? LangService.strings.LOCATIONS : LangService.strings.LOCATION;
    textString = `${LangService.strings.TOUR} ${LangService.strings.WITH} ${guidesCount} ${locationString}`;
    textString = textString.toUpperCase();
  } else if (type === "guide") {
    textString = `${LangService.strings.MEDIAGUIDE} ${LangService.strings.WITH} ${guidesCount} ${LangService.strings.OBJECT}`;
  }

  if (!textString) return null;

  return (<Text style={styles.listItemGuideCount}>{textString}</Text>);
}

const NavigationListItem = (props: Props) => {
  const { item } = props;
  return (<TouchableOpacity
    onPress={() => props.onPressItem(item)}
    style={styles.listItemContainer}
  >
    <View style={styles.imageWrapper}>
      <Image
        style={styles.listItemImage}
        source={{ uri: item.image }}
      />
    </View>
    <View style={styles.listItemTextContainer}>
      <Text style={styles.listItemTitle}>{item.title}</Text>
      {renderGuideCount(item)}
    </View>
  </TouchableOpacity>
  );
};


export default NavigationListItem;
