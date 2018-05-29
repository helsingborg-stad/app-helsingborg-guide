// @flow

import React from "react";
import { Text } from "react-native";

type Props = {
  audio: AudioState,
  onClosePlayer: () => (void),
  onTogglePlaying: () => (void),
  onSlidingCallback: (value: number) => (void),
  onSliderValueCompletedCallback: (newPosition: number) => (void),
}

export default function (props: Props) {
  return (
    <Text>Audio Player</Text>
  );
}

