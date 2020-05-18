import React from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native";
import { Colors, TextStyles } from "@assets/styles";

type Props = {
  style?: ViewStyle,
  title: string,
  selected: Boolean,
  onPress: () => void
};

export default function SelectableButton({
  style,
  title,
  selected,
  onPress
}: Props) {
  const containerStyle = selected
    ? styles.selectedContainer
    : styles.normalContainer;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={style ? [style, containerStyle] : containerStyle}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const sharedContainer: ViewStyle = {
  borderRadius: 100,
  paddingVertical: 12,
  paddingHorizontal: 40,
  flexDirection: "row",
  justifyContent: "center",
  backgroundColor: Colors.gray10,
  borderWidth: 4
};

const styles = StyleSheet.create({
  normalContainer: {
    ...sharedContainer,
    borderColor: Colors.gray10
  },
  selectedContainer: {
    ...sharedContainer,
    borderColor: Colors.themeTertiary
  },
  text: TextStyles.body
});
