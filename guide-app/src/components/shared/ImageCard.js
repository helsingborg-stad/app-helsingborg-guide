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
import ImageView from "@shared-components/ImageView";
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
  const height = size === "compact" ? 191 : 280;

  return (
    <View style={styles.container}>
      <Touchable
        style={styles.buttonContainer} onPress={onPress}>
        {/*<ImageView style={[styles.image, { height }]} source={image} />*/}
        <Image style={[styles.image, { height }]} source={image} />
        <LinearGradient
          colors={["#00000000", "#000000bb"]}
          style={styles.gradientContainer}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.titleLabel}>{title}</Text>
              <Text style={styles.distance}>150m</Text>
            </View>
            <View style={styles.iconContainer}>
              {icons.map((icon, key) => (
                <Image key={key} source={icon} style={styles.icon} />
              ))}
            </View>
          </View>
        </LinearGradient>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    position: "relative",
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
  contentContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  textContainer: {
    position: 'relative',
    flexShrink: 1,
    width: '100%',
    height: 70,
    backgroundColor: 'white',
    justifyContent: "center",
  },
  iconContainer: {
    flexShrink: 0,
    flexDirection: "row",
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 8,
  },
  titleLabel: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '500',
    paddingLeft: 20,
    paddingBottom: 20,
    color: 'rgba(41, 41, 41, 1)',
  },
  distance: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    letterSpacing: 0.91,
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 15,
    fontSize: 16,
    color: 'rgba(41, 41, 41, 1)',
  },
  subTitleLabel: {
  },
  descriptionLabel: {},
  mapIcon: {
    width: 32,
    height: 32
  }
});

export default ImageCard;
