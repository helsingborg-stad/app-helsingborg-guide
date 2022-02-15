import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
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
    expandable,
  } = props;

  const isKeyBoardOpen = useKeyboard();
  const [focused, setFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const sliderRef = useRef(null);
  const [modalHeight] = useState(new Animated.Value(0));
  const [inputMargin] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [textWidth] = useState(new Animated.Value(0));

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

  useEffect(() => {
    if (expandable) {
      openModal();
      setShowModal(isKeyBoardOpen);
    }
  }, [isKeyBoardOpen]);


  const openModal = () => {
    Animated.timing(modalHeight, {
      toValue: isKeyBoardOpen ? Dimensions.get("window").height - height() : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(inputMargin, {
      toValue: isKeyBoardOpen ? 0 : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(textOpacity, {
      toValue: isKeyBoardOpen ? 1 : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(textWidth, {
      toValue: isKeyBoardOpen ? 80 : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };


  return (
    <View style={(expandable && isKeyBoardOpen) ? styles.wrapperFocused : styles.wrapper}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.inputContainer, {
            width: fullWidth ? "100%" : width,
            height: height(),
            marginRight: inputMargin,
          }]}>
          <TextInput
            style={[styles.textInput, style]}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder || ""}
            keyboardType={keyboardType || "numeric"}
            autoFocus={!!(autoFocus)}
            {...(!!(expandable) ? { onFocus: () => setFocused(true) } : {})}
            onSubmitEditing={(e) => console.log("rövhål")}
            {...(defaultValue ? { defaultValue: defaultValue } : {})}
            {...(placeholderTextColor ? { placeholderTextColor: placeholderTextColor } : {})}
          />
          {isSearch && <Icon name={"search"} size={22} color={iconColor ? iconColor : "#9D9D9D"} />}
        </Animated.View>
        <Animated.View style={{
          width: textWidth,
          opacity: textOpacity,

          alignItems: "flex-start",
          justifyContent: "center",
          marginRight: 0,
        }}
        >
          <Text
            numberOfLines={1}
          >Avt</Text>
        </Animated.View>
      </View>
      <Animated.View style={{ height: modalHeight, overflow: "visible", zIndex: 10 }}>

      </Animated.View>

    </View>
  );
};

export default _TextInput;
