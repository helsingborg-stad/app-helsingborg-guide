import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import styles from "./styles";

type Props = {
  labels: [],
  initialSelectedIndex: Number,
  onSegmentIndexChange?: ?(index: number) => void,
};

export const SegmentControlPill = ({
  initialSelectedIndex = 0,
  onSegmentIndexChange,
  labels,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

  const onPressSegment = useCallback(
    index => () => {
      setSelectedIndex(index);

      if (onSegmentIndexChange) {
        onSegmentIndexChange(index);
      }
    },
    [onSegmentIndexChange]
  );

  return (
    <View style={styles.container}>
      {labels.map((label, index) => (
        <View key={index} style={styles.pillContainer}>
          <TouchableOpacity
            style={[
              styles.pill,
              index === selectedIndex ? styles.pillActive : null,
            ]}
            onPress={onPressSegment(index)}
          >
            <Text
              style={[
                styles.label,
                index === selectedIndex ? styles.labelActive : null,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default SegmentControlPill;
