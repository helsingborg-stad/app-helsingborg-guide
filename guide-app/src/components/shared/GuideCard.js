import React, { memo } from "react";
import ImageCard from "./ImageCard";

import IconMapMarker from "@assets/images/mapPinIcon.png";
import IconChildFriendly from "@assets/images/kids-large.png";

type Props = {
  size?: "expanded" | "compact",
  image: string,
  title: string,
  subTitle?: string,
  description?: string,
  showMapIcon?: boolean,
  showChildFriendlyIcon?: boolean,
  onPress: () => void,
  distance?: any,
  geolocation: string,
  itemLocation: string,
  index: any,
  type: string,
};

const GuideCard = ({
                     id,
                     image,
                     onPress,
                     title = null,
                     subTitle = null,
                     size = "compact",
                     showMapIcon = false,
                     showChildFriendlyIcon = false,
                     geolocation,
                     itemLocation,
                     index,
                     type
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
      type={type}
      image={image}
      onPress={onPress}
      title={title}
      subTitle={subTitle}
      size={size}
      icons={icons}
      geolocation={geolocation}
      itemLocation={itemLocation}
    />
  );
};

export default memo(GuideCard);
