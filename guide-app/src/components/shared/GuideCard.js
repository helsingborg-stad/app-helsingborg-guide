import React, { memo } from "react";
import ImageCard from "./ImageCard";

import IconMapMarker from "@assets/images/mapPinIcon.png";
import IconChildFriendly from "@assets/images/kids-large.png";

type Props = {
  id: any,
  size?: "expanded" | "compact",
  image: string,
  title: string,
  subTitle?: string,
  slug?: string,
  description?: string,
  showMapIcon?: boolean,
  showChildFriendlyIcon?: boolean,
  onPress: () => void,
  distance?: any,
  geolocation: string,
  itemLocation: string,
  index: any,
  type: string,
  children: [],
  item: any,
  navigation: any,
};

const GuideCard = ({
  id,
  image,
  onPress,
  item,
  title = null,
  subTitle = null,
  slug,
  size = "compact",
  showMapIcon = false,
  showChildFriendlyIcon = false,
  geolocation,
  itemLocation,
  index,
  type,
  children,
  navigation,
}: Props) => {
  const icons = [];

  if (showChildFriendlyIcon) {
    icons.push(IconChildFriendly);
  }

  if (showMapIcon) {
    icons.push(IconMapMarker);
  }

  return (
    <ImageCard
      id={id}
      key={index}
      index={index}
      item={item}
      type={type}
      image={image}
      onPress={onPress}
      title={title}
      subTitle={subTitle}
      slug={slug}
      size={size}
      icons={icons}
      geolocation={geolocation}
      itemLocation={itemLocation}
      children={children}
      navigation={navigation}
    />
  );
};

export default memo(GuideCard);
