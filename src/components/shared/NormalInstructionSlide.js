import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { PropTypes } from "prop-types";
import BackgroundImage from "./BackgroundImage";

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#7B075E",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentContainer: {
    flex: 3,
    width: Dimensions.get("window").width * 0.75,
  },
  contentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    minHeight: 50,
    textAlign: "center",
  },
  logoContainer: {
    minHeight: Dimensions.get("window").height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
});

const NormalInstructionSlide = ({ style, content, thumbnailSource, backgroundImageSource }) => (
  <View style={[styles.slide]}>
    <View style={[styles.mainContainer, style]}>
      <View style={styles.logoContainer}>
        <Image resizeMethod="scale" resizeMode="center" source={thumbnailSource} />
      </View>
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.contentText}>{content}</Text>
        </ScrollView>
      </View>
    </View>
    <BackgroundImage source={backgroundImageSource} />
  </View>
);

NormalInstructionSlide.defaultProps = {
  style: null,
};

NormalInstructionSlide.propTypes = {
  style: PropTypes.object,
  content: PropTypes.string.isRequired,
  backgroundImageSource: PropTypes.number.isRequired,
  thumbnailSource: PropTypes.number.isRequired,
};

export default NormalInstructionSlide;
