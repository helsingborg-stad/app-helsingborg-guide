// @flow
import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import LangService from "../../../../services/langService";
import styles from "./styles";
import { SegmentControlHeight } from "../../SegmentControl/styles";
import { AnalyticsUtils } from "../../../../utils";
import { ListHeight, ListBottomMargin } from "../../MarkerListView/styles";

type Props = {
  angleDelta: number,
  verticalAngle: number
};

function HintAnalytics({ hint }) {
  useEffect(() => {
    AnalyticsUtils.logEvent("ar_hint_shown", { name: hint });
  }, [hint]);

  return null;
}

const isWithinRange = (value, min, max) => value > min && value < max;

const getCurrentHintLocalisationKey = (
  angle,
  cameraVerticalRotation
): ?string => {
  // Horizontal rotation
  if (angle > 20) {
    if (angle < 140) {
      return "AR_HINT_LOOK_LEFT";
    }
    if (angle < 220) {
      return "AR_HINT_TURN_AROUND";
    }
    if (angle < 340) {
      return "AR_HINT_LOOK_RIGHT";
    }
  }

  // Vertical rotation
  if (
    isWithinRange(cameraVerticalRotation, 90, 160) ||
    isWithinRange(cameraVerticalRotation, 25, 90)
  ) {
    return "AR_HINT_LOOK_UP";
  }
  if (
    isWithinRange(cameraVerticalRotation, 190, 270) ||
    isWithinRange(cameraVerticalRotation, 270, 340)
  ) {
    return "AR_HINT_LOOK_DOWN";
  }

  return null;
};

function OffscreenHint({ angleDelta, verticalAngle }: Props) {
  const localisationKey = getCurrentHintLocalisationKey(
    angleDelta,
    verticalAngle
  );
  const hint = localisationKey ? LangService.strings[localisationKey] : null;

  return (
    hint !== null && (
      <View
        style={{
          ...styles.hintContainer,
          top: SegmentControlHeight + 20,
          bottom: ListHeight + ListBottomMargin + 10
        }}
      >
        <HintAnalytics hint={localisationKey} />
        <View style={styles.hintOverlay}>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      </View>
    )
  );
}

const mapState = (state: RootState) => {
  const {
    arState: { angleDelta, verticalAngle }
  } = state;
  return { angleDelta, verticalAngle };
};

export default connect(mapState)(memo(OffscreenHint));
