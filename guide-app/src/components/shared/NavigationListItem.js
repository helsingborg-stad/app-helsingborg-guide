// @flow
import React, { useCallback } from "react";
import LangService from "@services/langService";
import { GuideUtils } from "@utils";
import GuideCard from "@shared-components/GuideCard";
import defaultImage from "@assets/images/no-image-featured-image.png";

type Props = {
  index: number,
  item: NavigationItem,
  onPressItem(item: NavigationItem): void
};

function getDescription(item: NavigationItem) {
  const { type, guide } = item;
  const guidesCount = GuideUtils.getGuidesCount(item);
  const plural = guidesCount > 1;

  let textString = "";

  if (guidesCount === 0) {
    return "";
  }

  if (type === "guidegroup") {
    const mediaGuideString: string = plural
      ? LangService.strings.MEDIAGUIDES
      : LangService.strings.MEDIAGUIDE;
    textString = `${guidesCount} ${mediaGuideString.toUpperCase()}`;
  } else if (type === "guide" && guide) {
    if (guide.guideType === "trail") {
      const locationString: string = plural
        ? LangService.strings.LOCATIONS
        : LangService.strings.LOCATION;
      textString = `${LangService.strings.TOUR} ${
        LangService.strings.WITH
      } ${guidesCount} ${locationString}`;
      textString = textString.toUpperCase();
    } else if (guide.guideType === "guide") {
      textString = `${LangService.strings.MEDIAGUIDE} ${
        LangService.strings.WITH
      } ${guidesCount} ${LangService.strings.OBJECT}`;
    }
  }

  return textString;
}

function getNameAndImage(
  item: NavigationItem
): { imageUrl: ?string, name: ?string } {
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
    name: null
  };
}
function isChildFriendly(item: NavigationItem): boolean {
  const { guide } = item;
  if (guide) {
    return guide.childFriendly;
  }
  return false;
}

const NavigationListItem = ({ index, item, onPressItem }: Props) => {
  const { imageUrl, name } = getNameAndImage(item);
  const image = imageUrl ? { uri: imageUrl } : defaultImage;
  const size = index < 2 ? "expanded" : "compact";
  const showMapIcon = !!item.guide;

  const onPress = useCallback(() => {
    onPressItem(item);
  }, [item, onPressItem]);

  return (
    <GuideCard
      size={size}
      image={image}
      title={name}
      subTitle={getDescription(item)}
      showMapIcon={showMapIcon}
      showChildFriendlyIcon={isChildFriendly(item)}
      onPress={onPress}
    />
  );
};

export default NavigationListItem;
