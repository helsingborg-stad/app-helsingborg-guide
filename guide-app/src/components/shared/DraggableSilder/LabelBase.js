import React, { useEffect, memo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const AnimatedView = Animated.createAnimatedComponent(View);

const width = 15;

const LabelBase = (props) => {
  const { position, value, pressed } = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);

  useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) && (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position - width / 2,
            transform: [
              { translateY: width },
              { scale: scaleValue.current },
              { translateY: -width }
            ]
          }
        ]}
      >
        <View style={styles.pointer} />
        <Text style={styles.sliderLabelText}>{value}</Text>
      </AnimatedView>
    )
  );
};


const styles = StyleSheet.create({
  sliderLabel: {
    position: "absolute",
    top: -3,
    justifyContent: "center",
    bottom: "100%",
    width: width,
    height: width
  },
  sliderLabelText: {
    textAlign: "center",
    lineHeight: width,
    borderColor: "#999",
    backgroundColor: "transparent",
    flex: 1,
    color: "black",
    opacity: 0.7
  },
  pointer: {}
});

export default memo(LabelBase);
