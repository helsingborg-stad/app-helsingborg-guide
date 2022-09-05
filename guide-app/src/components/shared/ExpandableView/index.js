// @flow
import React, { type Node, memo, useState } from "react";
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import LangService from "@services/langService";
import ArrowUp from "@assets/images/arrow_up.svg";

const alphaGradient = require("@assets/images/gradient.png");

type Props = {
  style?: any,
  children?: Node,
  maxHeight: number,
};

const ExpandableView = (props: Props) => {
  const { maxHeight, style, children } = props;
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const showCollapsed = overflow && !expanded;
  const extraStyles = showCollapsed ? [styles.collapsed, { maxHeight }] : [];

  const onPress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={style || {}}>
      <TouchableWithoutFeedback
        onPress={onPress}
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          if (height > maxHeight) {
            setOverflow(true);
          }
        }}
      >
        <View style={[...extraStyles]}>
          {children || null}
          {showCollapsed ? (
            <Image
              source={alphaGradient}
              resizeMode="stretch"
              style={styles.alphaGradient}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={onPress}>
        {showCollapsed ? (
          <Text style={styles.readMoreText}>
            {LangService.strings.READ_MORE}
          </Text>
        ) : overflow ? (
          <View style={styles.collapse}>
            <ArrowUp />
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default memo(ExpandableView);
