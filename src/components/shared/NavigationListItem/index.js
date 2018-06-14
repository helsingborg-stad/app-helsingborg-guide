
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

const defaultImage = require("../../../images/no-image-featured-image.png");
const iconKids = require("../../../images/kids.png");

type Props = {
  item: NavigationItem,
  onPressItem(item: NavigationItem): void
};

function getGuidesCount(guideGroup: ?GuideGroup): number {
  if (!guideGroup) return 0;
  if (!guideGroup.guidesCount) return 0;
  return guideGroup.guidesCount;
}

function getGuidesCountFromGuide(guide: ?Guide): number {
  if (!guide) return 0;
  return guide.contentObjects.length;
}

function renderGuideCount(item: NavigationItem) {
  const { type, guide, guideGroup } = item;


  let textString = null;
  if (type === "guidegroup") {
    const guidesCount = getGuidesCount(guideGroup);
    const plural = guidesCount > 1;
    const mediaGuideString: string = plural ? LangService.strings.MEDIAGUIDES : LangService.strings.MEDIAGUIDE;
    textString = `${guidesCount} ${mediaGuideString.toUpperCase()}`;
  } else if (type === "guide" && guide && guide.guideType === "trail") {
    const guidesCount = getGuidesCountFromGuide(guide);
    const plural = guidesCount > 1;
    const locationString: string = plural ? LangService.strings.LOCATIONS : LangService.strings.LOCATION;
    textString = `${LangService.strings.TOUR} ${LangService.strings.WITH} ${guidesCount} ${locationString}`;
    textString = textString.toUpperCase();
  } else if (type === "guide" && guide && guide.guideType === "guide") {
    const guidesCount = getGuidesCountFromGuide(guide);
    textString = `${LangService.strings.MEDIAGUIDE} ${LangService.strings.WITH} ${guidesCount} ${LangService.strings.OBJECT}`;
  }

  if (!textString) return null;

  return (<Text style={styles.listItemGuideCount}>{textString}</Text>);
}

function getNameAndImage(item: NavigationItem): { imageUrl: ?string, name: ?string } {
  const { guide, guideGroup } = item;
  if (guide) {
    const { name, images } = guide;
    return { imageUrl: images.large, name };
  }
  if (guideGroup) {
    const { name, images } = guideGroup;
    return { name, imageUrl: images.large };
  }
  return {
    imageUrl: null,
    name: null,
  };
}
function isChildFriendly(item: NavigationItem): boolean {
  const { guide } = item;
  if (guide) {
    return guide.childFriendly;
  }
  return false;
}

function renderChildFriendly() {
  return (
    <View style={styles.forChildrenContainer} >
      <Text style={styles.forChildrenText}>{LangService.strings.FOR_CHILDREN.toUpperCase()}</Text>
      <Image source={iconKids} resizeMode="contain" style={styles.forChildrenIcon} />
    </View >
  );
}

const NavigationListItem = (props: Props) => {
  const { item } = props;
  const { imageUrl, name } = getNameAndImage(item);
  const childFriendly = isChildFriendly(item);
  const image = imageUrl ? { uri: imageUrl } : defaultImage;
  return (<TouchableOpacity
    onPress={() => props.onPressItem(item)}
    style={styles.listItemContainer}
  >
    <View style={styles.imageWrapper}>
      <Image
        style={styles.listItemImage}
        source={image}
      />
    </View>
    <View style={styles.listItemTextContainer}>
      <Text style={styles.listItemTitle}>{name}</Text>
      <View style={styles.extrasContainer}>
        {renderGuideCount(item)}
        {childFriendly ? renderChildFriendly() : null}
      </View>
    </View>
  </TouchableOpacity>
  );
};


export default NavigationListItem;
