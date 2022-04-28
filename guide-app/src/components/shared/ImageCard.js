import React, { memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageSourcePropType
} from "react-native";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { Colors, TextStyles } from "@assets/styles";
import Touchable from "@shared-components/Touchable";
import DistanceView from "@shared-components/DistanceViewNew";
import ImageView from "@shared-components/ImageView";
import LangService from "@services/langService";

type Props = {
  size?: "expanded" | "compact",
  image: string,
  title: string,
  subTitle?: string,
  icons?: ImageSourcePropType[],
  onPress: () => void,
  geolocation: string,
  itemLocation: string,
  index: any,
  type: string,
};

const ImageCard = ({
                     id,
                     image,
                     onPress,
                     title = null,
                     subTitle = null,
                     size = "compact",
                     icons = [],
                     geolocation,
                     itemLocation,
                     index,
                     type
                   }: Props) => {
  const height = size === "compact" ? 191 : 258;

  const { all } = useSelector(s => s.guides);

  const displayActivities = () => {
    switch (type) {
      case "guidegroup":
        const groupAmount = all?.guideGroups?.find(item => item.parentID === id);
        return groupAmount ? (groupAmount.guideAmount + " " + LangService.strings.EXPERIENCES).toUpperCase() : "";
      case "guide":
        const guideAmount = all?.guides?.find(item => item.parentID === id);
        return guideAmount ? (guideAmount.guideAmount + " " + LangService.strings.EXPERIENCES).toUpperCase() : "";
    }
  };

  const displayIcon = (icon) => {
    switch (icon) {
      case 13:
        return "map";
      case 14:
        return "children";
      default:
        return;
    }
  };

  function displayDistance(currentLocation: GeolocationType, location: Location) {
    return (
      <DistanceView
        textStyle={styles.distance}
        currentLocation={currentLocation}
        location={location}
      />
    );
  }

  return (
    <View
      key={index}
      style={styles.container}>
      <Touchable
        style={styles.buttonContainer} onPress={onPress}>
        <ImageView style={[styles.image, { height }]} source={{ uri: image?.uri }} />
        <LinearGradient
          colors={["#00000000", "#000000bb"]}
          style={styles.gradientContainer}>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.titleLabel}>{title}</Text>
            <Text style={[styles.text, styles.subTitleLabel]}>
              {displayActivities()}
            </Text>
            {itemLocation && geolocation && (
              <View style={styles.distanceContainer}>
                {displayDistance(geolocation, itemLocation)}
              </View>
            )}
          </View>
        </LinearGradient>
      </Touchable>
      {icons.map((icon, i) => (
        <View
          key={i}
          style={styles[displayIcon(icon)]}>
          <Image key={i} source={icon} style={styles.icon} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: Colors.white,
    elevation: 5,
    marginBottom: 16
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: "hidden",
    position: "relative"
  },
  image: {
    flex: 1,
    width: "100%"
  },
  text: {
    ...TextStyles.defaultFontFamily
  },
  gradientContainer: {
    bottom: 0,
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: 100
  },
  contentContainer: {},
  textContainer: {
    position: "relative",
    flexShrink: 1,
    width: "100%",
    height: 85,
    backgroundColor: "white",
    justifyContent: "flex-start",
    paddingTop: 10
  },

  icon: {
    width: 32,
    height: 32
  },

  children: {
    position: "absolute",
    top: 0,
    marginTop: 20,
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    padding: 0,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "visible"
  },

  map: {
    position: "absolute",
    bottom: 70,
    right: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "visible"
  },

  titleLabel: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "500",
    paddingLeft: 20,
    paddingRight: 70,
    color: "rgba(41, 41, 41, 1)"
  },
  distance: {
    fontFamily: "Roboto",
    fontWeight: "400",
    letterSpacing: 0.91,
    position: "absolute",
    right: 0,
    bottom: -40,
    padding: 15,
    fontSize: 16,
    color: "rgba(41, 41, 41, 1)"
  },
  subTitleLabel: {
    paddingLeft: 20,
    fontFamily: "Roboto",
    fontWeight: "500",
    letterSpacing: 0.91,
    color: Colors.gray3,
    paddingTop: 5,
    fontSize: 12
  },
  descriptionLabel: {},
  mapIcon: {
    width: 32,
    height: 32
  }
});

export default memo(ImageCard);
