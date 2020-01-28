import React from "react";
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
  onPress: () => void
};

const GuideCard = ({
  image,
  onPress,
  title = null,
  subTitle = null,
  size = "compact",
  showMapIcon = false,
  showChildFriendlyIcon = false
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
      image={image}
      onPress={onPress}
      title={title}
      subTitle={subTitle}
      size={size}
      icons={icons}
    />
  );
};

export default GuideCard;
