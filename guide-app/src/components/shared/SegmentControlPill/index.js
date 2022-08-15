import React, { useCallback, useEffect, useState, memo } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import styles from "./styles";
import { trackScreen } from "../../../utils/MatomoUtils";
import LangService from "@services/langService";
import { useSelector } from "react-redux";

type Props = {
  labels: [],
  initialSelectedIndex: Number,
  onSegmentIndexChange?: ?(index: number) => void,
};

export const SegmentControlPill = ({
                                     initialSelectedIndex = 0,
                                     onSegmentIndexChange,
                                     labels
                                   }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const { currentHomeTab } = useSelector(s => s.uiState);

  const onPressSegment = useCallback(
    (index, label) => () => {
      setSelectedIndex(index);
      const path = `/${index ? "experiences" : "map"}`;
      trackScreen(path, path);
      if (onSegmentIndexChange) {
        onSegmentIndexChange(index);
      }
    },
    [onSegmentIndexChange]
  );
  useEffect(() => {
    trackScreen(`/places`, `/places`);
    return setSelectedIndex(0);
  }, []);

  useEffect(() => {
    setSelectedIndex(currentHomeTab);
  }, [currentHomeTab]);

  return (
    <View style={styles.container}>
      {labels.map((label, index) => (
        <View key={index} style={styles.pillContainer}>
          <TouchableOpacity
            style={[
              styles.pill,
              index === selectedIndex ? styles.pillActive : null
            ]}
            onPress={onPressSegment(index, label)}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                index === selectedIndex ? styles.labelActive : null
              ]}
            >
              {label === "map" ? LangService.strings.MAP : label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default memo(SegmentControlPill);
