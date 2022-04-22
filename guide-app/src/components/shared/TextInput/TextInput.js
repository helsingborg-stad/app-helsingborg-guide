import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Keyboard,
  FlatList,
} from "react-native";
import { Portal, Host } from "react-native-portalize";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import useKeyboard from "@hooks/useKeyboard";
import LangService from "@services/langService";
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
    flex,
    modalDimensions
  } = props;

  const isKeyBoardOpen = useKeyboard();
  const [focused, setFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);
  const modalInputRef = useRef(null);
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
    showModal && inputRef?.current?.focus();
  }, [showModal]);


  const toggleModal = (e) => {
        !showModal && e.split("").length && setShowModal(true);
        showModal && e.split("").length === 0 && setShowModal(false);
  }

  return (
    <>
    <View
      style={[((expandable && isKeyBoardOpen) ? styles.wrapperFocused : styles.wrapper), { ...(flex && { flex: 1 }) }]}>
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
              expandable && toggleModal(e)
              onChangeText && onChangeText(e);
            }}
            value={value}
            placeholder={placeholder || ""}
            keyboardType={keyboardType || "default"}
            autoFocus={!!(autoFocus)}
            {...(!!(expandable) ? { onFocus: () => setFocused(true) } : {})}
            {...(defaultValue ? { defaultValue: defaultValue } : {})}
            {...(placeholderTextColor ? { placeholderTextColor: placeholderTextColor } : {})}
            onFocus={() => {
              if (isSearch && expandable) {
                inputRef?.current?.focus();
              }
            }}
            onSubmitEditing={() => setShowModal(false)}
            onBlur={() => setShowModal(false)}
          />
          {isSearch &&
          <TouchableOpacity
            onPress={() => isKeyBoardOpen ? (() => {
              Keyboard.dismiss();
              inputRef?.current?.clear();
            })() : inputRef?.current?.focus()}
          >
             <Icon name={isKeyBoardOpen ? "close" : "search"} size={22} color={iconColor || "#9D9D9D"} />
          </TouchableOpacity>
          }
        </Animated.View>
        <TouchableOpacity
          style={[styles.textInputCancelButton, { opacity: textOpacity }]}
          onPress={() => Keyboard.dismiss()}
        >
        </TouchableOpacity>
      </View>
      {showModal &&
        <Portal>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            ...(modalDimensions?.height && {height: Dimensions.get("window").height - modalDimensions?.height}),
            backgroundColor: "gray",
            width: "100%",
            zIndex: 9999999,
            overflow: "visible",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: '100%',
              backgroundColor: 'white',
            }}
            onPress={() => Keyboard.dismiss()}
          >

          </TouchableOpacity>
        </View>
      </Portal>
      }
    </View>
      </>
  );
};

export default _TextInput;
