import React, { useRef, useState, memo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import useKeyboard from "@hooks/useKeyboard";
import styles from "./style";

const _TextInput = (props) => {
  const {
    style,
    size,
    width,
    fullWidth,
    onChangeText,
    value,
    defaultValue,
    placeholder,
    placeholderTextColor,
    keyboardType,
    isSearch,
    iconColor,
    autoFocus,
    flex,
  } = props;

  const isKeyBoardOpen = useKeyboard();
  const inputRef = useRef(null);
  const [inputMargin] = useState(new Animated.Value(0));

  const height = () => {
    switch (size) {
      case "small":
        return 30;
      case "standard":
        return 55;
      case "big":
        return 70;
      default:
        return 55;
    }
  };

  return (
      <View
        style={[styles.wrapper, { ...(flex && { flex: 1 }) }]}>
        <View style={styles.container}>
          <Animated.View
            style={[styles.inputContainer, {
              width: fullWidth ? "100%" : width,
              height: height(),
              marginRight: inputMargin,
            }]}>
            <TextInput
              ref={inputRef}
              style={[styles.textInput, style]}
              onChangeText={(e) => {
                onChangeText && onChangeText(e);
              }}
              value={value}
              placeholder={placeholder || ""}
              keyboardType={keyboardType || "default"}
              autoFocus={!!(autoFocus)}
              {...(defaultValue ? { defaultValue: defaultValue } : {})}
              {...(placeholderTextColor ? { placeholderTextColor: placeholderTextColor } : {})}
              onFocus={() => {
                if (isSearch) {
                  inputRef?.current?.focus();
                }
              }}
            />
            {isSearch &&
            <TouchableOpacity
              onPress={() => isKeyBoardOpen ? (() => {
                Keyboard.dismiss();
                onChangeText("");
                inputRef?.current?.clear();
              })() : inputRef?.current?.focus()}
            >
              <Icon name={isKeyBoardOpen ? "close" : "search"} size={28} color={iconColor || "#383838"} />
            </TouchableOpacity>
            }
          </Animated.View>
        </View>
      </View>
  );
};

export default memo(_TextInput)
