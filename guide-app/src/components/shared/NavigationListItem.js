// @flow
import React, { useCallback, useState } from "react";
import LangService from "@services/langService";
import { GuideUtils } from "@utils";
import GuideCard from "@shared-components/GuideCard";
import defaultImage from "@assets/images/no-image-featured-image.png";
import { useSelector } from "react-redux";

type Props = {
  index: number,
  item: NavigationItem,
  onPressItem(item: NavigationItem): void
};

function getDescription(item: NavigationItem) {


  const { type, guide, interactiveGuide } = item;
  const guidesCount = GuideUtils?.getGuidesCount(item);
  const plural = guidesCount > 1;

  let textString = "";

  // Disable guidegroup for now until correct guideCount is shown.

  if ((type === "guide" && guidesCount === 0)) {
    return "";
  }


  if (type === "guidegroup") {
    const mediaGuideString: string = plural
      ? LangService.strings.ACTIVITIES
      : LangService.strings.ACTIVITY;
    textString = `${guidesCount} ${mediaGuideString.toUpperCase()}`;
  } else if (type === "guide" && guide) {
    if (guide?.guideType === "trail") {
      const locationString: string = plural
        ? LangService.strings.ACTIVITIES
        : LangService.strings.ACTIVITY;
      textString = `${guidesCount} ${locationString}`;
      textString = textString.toUpperCase();
    } else if (guide?.guideType === "guide") {
      textString = `${guidesCount} ${LangService.strings.ACTIVITIES}`;
      textString = textString.toUpperCase();
    }
  } else if (type === "interactive_guide") {
    if(!!interactiveGuide?.steps?.length) {
      textString = `${interactiveGuide?.steps?.length -1} ${LangService.strings.ACTIVITIES}`.toUpperCase();
//       textString = `${LangService.strings.MEDIAGUIDE_INTERACTIVE}
// ${LangService.strings.WITH} ${interactiveGuide?.steps?.length - 1} ${LangService.strings.OBJECT}`.toUpperCase();
    } else {
      // textString = `${LangService.strings.MEDIAGUIDE_INTERACTIVE}`.toUpperCase()
    }
  }

  return textString;
}

function getNameAndImage(
  item: NavigationItem,
): { imageUrl: ?string, name: ?string } {
  const { guide, guideGroup, interactiveGuide } = item;
  if (guide) {
    const { name, images } = guide;
    return { imageUrl: images?.large, name };
  }
  if (guideGroup) {
    const { name, images } = guideGroup;
    return { name, imageUrl: images?.large };
  }
  if (interactiveGuide) {
    const { name, images } = interactiveGuide;
    return { name, imageUrl: images?.large };
  }
  return {
    imageUrl: null,
    name: null,
  };
}

function isChildFriendly(item: NavigationItem): boolean {
  const { guide } = item;
  if (guide) {
    return guide?.childFriendly;
  }
  return false;
}

const NavigationListItem = ({ index, item, onPressItem }: Props) => {

  const { imageUrl, name } = getNameAndImage(item);
  const image = imageUrl ? { uri: imageUrl } : defaultImage;
  const size = index < 2 ? "expanded" : "compact";
  const showMapIcon = !!item?.guide;
  const { geolocation } = useSelector(s => s);
  const itemLocation = item?.guideGroup?.location || item?.guide?.location || item?.interactiveGuide?.location;

  const onPress = useCallback(() => {
    onPressItem(item);
  }, [item, onPressItem]);




  return (
    <GuideCard
      key={index}
      index={index}
      size={size}
      geolocation={geolocation}
      itemLocation={itemLocation}
      image={image}
      title={name || ""}
      subTitle={getDescription(item)}
      showMapIcon={showMapIcon}
      showChildFriendlyIcon={isChildFriendly(item)}
      onPress={onPress}
    />
  );
};

export default NavigationListItem;
