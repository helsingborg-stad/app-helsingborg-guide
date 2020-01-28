import React from "react";
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

type Props = {
  size?: "expanded" | "compact",
  image: string,
  title: string,
  subTitle?: string,
  icons?: ImageSourcePropType[],
  onPress: () => void
};

const ImageCard = ({
  image,
  onPress,
  title = null,
  subTitle = null,
  size = "compact",
  icons = []
}: Props) => {
  const height = size === "compact" ? 253 : 360;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <ImageView style={[styles.image, { height }]} source={image} />
        <LinearGradient
          colors={["#00000000", "#000000bb"]}
          style={styles.gradientContainer}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.titleLabel}>{title}</Text>

              {subTitle !== null && (
                <Text style={[styles.text, styles.subTitleLabel]}>
                  {subTitle}
                </Text>
              )}
            </View>

            <View style={styles.iconContainer}>
              {icons.map((icon, key) => (
                <Image key={key} source={icon} style={styles.icon} />
              ))}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
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
  contentContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    margin: 16
  },
  textContainer: {
    marginRight: 16,
    flexShrink: 1
  },
  iconContainer: {
    flexShrink: 0,
    flexDirection: "row"
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 8
  },
  titleLabel: { color: Colors.white, fontSize: 20, lineHeight: 26.5 },
  subTitleLabel: {
    color: Colors.gray9,
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 1,
    marginTop: 4
  },
  descriptionLabel: {},
  mapIcon: {
    width: 32,
    height: 32
  }
});

export default ImageCard;
