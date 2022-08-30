// @flow
import React, { memo, useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Animated, View, Image, Dimensions, Platform } from "react-native";
import styles from "./style";
import { selectCurrentBottomBarTab } from "@actions/uiStateActions";
import { Navigation } from "@config/ui";
import { setShowFilterButton } from "@actions/uiStateActions";

const barBackground = require("@assets/images/background-navigation.png");

// Sorry /Björn
// TODO: rename to something with isIphoneXOrAbove?
const isIphoneX = () => {
  const d = Dimensions.get("window");
  const { height, width } = d;
  return Platform.OS === "ios" && (height >= 812 || width >= 812);
};

const viewContainerHeight: number = isIphoneX() ? 84 : 68;
const buttonTabBottom: number = isIphoneX() ? 84 : 68;
const transitionDuration: number = 300;

const BottomBarView = () => {
  const dispatch = useDispatch();
  const { currentBottomBarTab, showBottomBar } = useSelector(s => s.uiState);
  const { currentLanguage } = useSelector(s => s.navigation);
  const [animViewContainer, setAnimViewContainer] = useState(new Animated.Value(0));
  const [animTabBottom, setAnimTabBottom] = useState(new Animated.Value(0));

  useEffect(() => {
    updateBottomBar();
  }, [showBottomBar, currentLanguage]);

  const updateBottomBar = () => {
    if (showBottomBar) {
      Animated.timing(animViewContainer, {
        toValue: viewContainerHeight,
        duration: transitionDuration,
        useNativeDriver: false
      }).start();
      Animated.timing(animTabBottom, {
        toValue: buttonTabBottom,
        duration: transitionDuration,
        useNativeDriver: false
      }).start();
    } else {
      setAnimViewContainer(new Animated.Value(0));
      setAnimTabBottom(new Animated.Value(0));
    }
  };

  const displayIcons = () => {
    return (
      <View style={styles.iconContainer}>
        {Navigation.bottomBarButtons.map(({ id, ButtonComponent }, index) => (
          <ButtonComponent
            key={id}
            selected={currentBottomBarTab === index}
            onPress={() => {
              dispatch(selectCurrentBottomBarTab(index));
              dispatch(setShowFilterButton(id === "home"));
            }}
          />
        ))}
      </View>
    );
  };

  return (
    showBottomBar ?
      <Animated.View
        style={[styles.viewContainer, { height: animViewContainer }]}
      >
        <Image style={styles.imageBackground} source={barBackground} />
        {displayIcons()}
      </Animated.View> : null
  );
};

export default memo(BottomBarView);
