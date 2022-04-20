import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageSourcePropType
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors, TextStyles } from "@assets/styles";
import Touchable from "@shared-components/Touchable";


type Props = {
  size?: "expanded" | "compact",
  image: string,
  title: string,
  subTitle?: string,
  icons?: ImageSourcePropType[],
  onPress: () => void,
};

const ImageCard = ({
                     image,
                     onPress,
                     title = null,
                     subTitle = null,
                     size = "compact",
                     icons = []
                   }: Props) => {
  const height = size === "compact" ? 191 : 258;

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


  return (
    <View style={styles.container}>
      <Touchable
        style={styles.buttonContainer} onPress={onPress}>
        <Image style={[styles.image, { height }]} source={image} />
        <LinearGradient
          colors={["#00000000", "#000000bb"]}
          style={styles.gradientContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.titleLabel}>{title}</Text>
            <Text style={styles.distance}>150m</Text>
          </View>
        </LinearGradient>
      </Touchable>
      {icons.map((icon, key) => (
        <View style={styles[displayIcon(icon)]}>
          <Image key={key} source={icon} style={styles.icon} />
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
    height: 77,
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
    bottom: 60,
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
    bottom: 0,
    padding: 15,
    fontSize: 16,
    color: "rgba(41, 41, 41, 1)"
  },
  subTitleLabel: {},
  descriptionLabel: {},
  mapIcon: {
    width: 32,
    height: 32
  }
});

export default ImageCard;
