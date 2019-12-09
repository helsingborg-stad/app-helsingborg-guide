import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { PropTypes } from "prop-types";
import LangService from "@services/langService";
import BackgroundImage from "@shared-components/BackgroundImage";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";

const LOGO = require("@assets/images/logo.png");

const styles = StyleSheet.create({
  slide: {
    backgroundColor: Colors.themeSecondary,
    flex: 1
  },
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 50
  },
  headerContainer: {
    flex: 1,
    minHeight: Dimensions.get("window").height * 0.35,
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      color: Colors.white,
      fontSize: 38,
      fontWeight: "300",
      lineHeight: 36,
      minHeight: 50
    }
  ]),
  contentContainer: {
    flex: 3,
    width: Dimensions.get("window").width * 0.7
  },
  contentText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      color: Colors.white,
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 26,
      minHeight: 50,
      textAlign: "center"
    }
  ]),
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 22
  },
  logo: { width: 62, height: 66 }
});

const FirstInstructionSlide = ({ style, content, backgroundImageSource }) => (
  <View style={[styles.slide]}>
    <View style={[styles.mainContainer, style]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{LangService.strings.GUIDE}</Text>
        <Text style={styles.headerText}>{LangService.strings.CITY_NAME}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{content}</Text>
      </View>

      <View style={styles.logoContainer}>
        <Image resizeMethod="scale" resizeMode="center" source={LOGO} />
      </View>
    </View>
    <BackgroundImage source={backgroundImageSource} />
  </View>
);

FirstInstructionSlide.defaultProps = {
  style: null
};

FirstInstructionSlide.propTypes = {
  style: PropTypes.object,
  content: PropTypes.string.isRequired,
  backgroundImageSource: PropTypes.number.isRequired
};

export default FirstInstructionSlide;
