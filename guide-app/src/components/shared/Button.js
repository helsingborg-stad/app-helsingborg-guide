import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors, TextStyles } from "@assets/styles";

type Props = {
  style?: ViewStyle,
  title: string,
  onPress: () => void
};

export default function Button({ style, title, onPress }: Props) {
  const [pressed, setPressed] = useState(false);
  const containerStyle = pressed
    ? styles.pressedContainer
    : styles.normalContainer;

  let buttonContent;
  if (pressed) {
    buttonContent = (
      <View style={style ? [style, containerStyle] : containerStyle}>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  } else {
    buttonContent = (
      <View>
        <LinearGradient
          colors={[Colors.themePrimary, Colors.themeTertiary]}
          useAngle
          angle={90 - 22}
          style={style ? [style, containerStyle] : containerStyle}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {buttonContent}
    </TouchableWithoutFeedback>
  );
}

const sharedContainer: ViewStyle = {
  borderRadius: 100,
  paddingVertical: 14,
  paddingHorizontal: 40,
  flexDirection: "row",
  justifyContent: "center"
};

const styles = StyleSheet.create({
  normalContainer: {
    ...sharedContainer,
    backgroundColor: Colors.themePrimary
  },
  pressedContainer: {
    ...sharedContainer,
    backgroundColor: Colors.themePrimary
  },
  text: StyleSheet.flatten([TextStyles.body, { color: Colors.white }])
});
