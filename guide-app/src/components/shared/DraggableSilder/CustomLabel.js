import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import LabelBase from "./LabelBase";

const CustomLabel = (props) => {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
    min,
    max
  } = props;

  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
        min={min}
        max={max}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
        min={min}
        max={max}
      />
    </View>
  );
};

CustomLabel.defaultProps = {
  leftDiff: 0
};

const styles = StyleSheet.create({
  parentView: {
    position: "relative"
  }
});

export default memo(CustomLabel);

