import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import ViewContainer from "@shared-components/view_container";
import FirstInstructionSlide from "@shared-components/FirstInstructionSlide";
import NormalInstructionSlide from "@shared-components/NormalInstructionSlide";
import { IS_WELCOMED } from "@src/lib/my_consts";
import LangService from "@services/langService";
import ColoredBar from "@shared-components/ColoredBar";
import { showBottomBar } from "@actions/uiStateActions";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";
import * as navigation from "@utils/NavigationUtils";

const IMAGE1 = require("@assets/images/firstInstructionImage.png");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  swiper: {
    backgroundColor: Colors.themeSecondary,
  },
  dot: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    height: 9,
    marginVertical: 6,
    marginHorizontal: 10,
    width: 9,
  },
  activeDot: {
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    borderRadius: 7,
    borderWidth: 3,
    borderColor: Colors.white,
    height: 14,
    marginVertical: 7,
    marginHorizontal: 10,
    width: 14,
  },
  pagination: {
    top: 300,
  },
  btnContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.white,
    bottom: 110,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
    justifyContent: "center",
    position: "absolute",
  },
  btnText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      color: Colors.themeSecondary,
      fontWeight: "500",
      fontSize: 15,
      lineHeight: 23,
      textAlign: "center",
      textAlignVertical: "center",
      includeFontPadding: false,
    },
  ]),
  colorBar: {
    left: 0,
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 20,
  },
});

const WelcomeScreen = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const total = LangService.instructions.steps.length;

  const displayColorBar = () => {
    return (
      <View style={styles.colorBar}>
        <ColoredBar visible />
      </View>
    );
  };

  useEffect(() => {
    dispatch(showBottomBar(false));
  }, []);

  const onIndexChanged = (i) => {
    setIndex(i);
  };

  const displaySlides = () => {
    const instructions = LangService.instructions.steps;
    return instructions.map((item, i) => {
      if (i === 0) {
        return (
          <FirstInstructionSlide
            key={i}
            content={item.content}
            backgroundImageSource={IMAGE1}
          />
        );
      }
      return (
        <NormalInstructionSlide
          key={i}
          content={item.content}
          thumbnailSource={item.thumbnail}
          backgroundImageSource={item.background}
        />
      );
    });
  };

  const skipPress = () => {
    AsyncStorage.setItem(IS_WELCOMED, JSON.stringify(true));
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  };

  const displaySkipBtn = () => {
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => skipPress()}>
          <Text style={styles.btnText}>
            {index === total - 1
              ? LangService.strings.LETS_GO
              : LangService.strings.JUMP_OVER}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const dot = <View style={styles.dot} />;
  const activeDot = <View style={styles.activeDot} />;

  return (
    <ViewContainer style={[styles.wrapper]}>
      <Swiper
        style={styles.swiper}
        onIndexChanged={onIndexChanged}
        loop={false}
        dot={dot}
        paginationStyle={styles.pagination}
        activeDot={activeDot}
        showsButtons={false}
      >
        {displaySlides()}
      </Swiper>
      {displaySkipBtn()}
      {displayColorBar()}
    </ViewContainer>
  );
};

export default WelcomeScreen;
