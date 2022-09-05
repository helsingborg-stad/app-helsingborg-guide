// @flow
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import styles from "./styles";

type Props = {
  labels: Array<string>,
  initalSelectedIndex?: number,
  onSegmentIndexChange?: ?(index: number) => void,
  style: any,
};

const SegmentControl = (props: Props) => {
  const { onSegmentIndexChange, labels, style, initalSelectedIndex } =
    props || {};
  const [selectedIndex, setSelectedIndex] = useState(
    props.initalSelectedIndex || 0
  );
  let containerWidth = 0;
  let selectedViewLeftInset = new Animated.Value(0);

  const onPressSegmentIndex = (index: number) => {
    Animated.spring(selectedViewLeftInset, {
      toValue: (index / labels.length) * containerWidth,
      useNativeDriver: true,
    }).start();
    setSelectedIndex(index);
    if (onSegmentIndexChange) {
      onSegmentIndexChange(index);
    }
  };

  const renderSegmentItem = (label: string, index: number) => {
    return (
      <TouchableOpacity
        style={styles.segmentItem}
        key={label}
        onPress={() => onPressSegmentIndex(index)}
      >
        <Text
          style={
            index === selectedIndex
              ? styles.segmentLabelSelected
              : styles.segmentLabel
          }
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const width = (1 / labels.length) * 100;
  const selectionViewStyle = {
    width: `${width}%`,
    left: selectedViewLeftInset,
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => {
        if (containerWidth === 0) {
          containerWidth = e.nativeEvent.layout.width;
          selectedViewLeftInset = new Animated.Value(
            ((initalSelectedIndex || 0) / labels.length) * containerWidth
          );
        }
      }}
    >
      {labels.map(renderSegmentItem)}
      <Animated.View style={[styles.selectionView, selectionViewStyle]} />
    </View>
  );
};

export default SegmentControl;
