// @flow
import React, { memo } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import LangService from "../../../../services/langService";
import styles from "./styles";
import { SegmentControlHeight } from "../../SegmentControl/styles";
import { ListHeight, ListBottomMargin } from "../../MarkerListView/styles";

type Props = {
  angleDelta: number,
  verticalAngle: number,
};

const isWithinRange = (value, min, max) => value > min && value < max;

const getCurrentHintText = (angleDelta, verticalAngle): ?string => {
  // Horizontal rotation
  if (angleDelta > 20) {
    if (angleDelta < 140) {
      return LangService.strings.AR_HINT_LOOK_LEFT;
    }
    if (angleDelta < 220) {
      return LangService.strings.AR_HINT_TURN_AROUND;
    }
    if (angleDelta < 340) {
      return LangService.strings.AR_HINT_LOOK_RIGHT;
    }
  }

  // Vertical rotation
  if (isWithinRange(verticalAngle, 90, 160) || isWithinRange(verticalAngle, 25, 90)) {
    return LangService.strings.AR_HINT_LOOK_UP;
  }
  if (isWithinRange(verticalAngle, 190, 270) || isWithinRange(verticalAngle, 270, 340)) {
    return LangService.strings.AR_HINT_LOOK_DOWN;
  }

  return null;
};

function OffscreenHint({ angleDelta, verticalAngle }: Props) {
  const hint = getCurrentHintText(angleDelta, verticalAngle);

  return (hint !== null) && (
    <View style={{ ...styles.hintContainer, top: SegmentControlHeight + 20, bottom: ListHeight + ListBottomMargin + 10 }}>
      <View style={styles.hintOverlay}>
        <Text style={styles.hintText}>{hint}</Text>
      </View>
    </View>
  );
}

const mapState = (state: RootState) => {
  const { arState: { angleDelta, verticalAngle } } = state;
  return { angleDelta, verticalAngle };
};

export default connect(mapState)(memo(OffscreenHint));
