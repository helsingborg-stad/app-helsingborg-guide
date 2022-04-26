import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import LabelBase from "./LabelBase";



const width = 15;

const CustomLabel = (props) => {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;

  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

CustomLabel.defaultProps = {
  leftDiff: 0,
};

const styles = StyleSheet.create({
  parentView: {
    position: 'relative',
  },
});

export default memo(CustomLabel);

