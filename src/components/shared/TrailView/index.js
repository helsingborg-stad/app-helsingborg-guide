// @flow

import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import styles from "./style";

import MapInformationOverlay from "../../shared/MapInformationOverlay";


type Props = {
  trail: Guide,
  showInfoOverlay: boolean,
  onToggleInfoOverlay: () => (void),
}

function renderMapInformationOverlay(trail: Guide, onToggleInfoOverlay: () => (void)) {
  if (!trail) { return null; }

  return (
    <TouchableWithoutFeedback
      onPress={onToggleInfoOverlay}
    >
      <MapInformationOverlay
        trailInformation={{ title: trail.name, description: trail.description }}
        onPressFunction={onToggleInfoOverlay}
      />
    </TouchableWithoutFeedback>
  );
}


const TrailView = (props: Props) => (
  props.showInfoOverlay ? renderMapInformationOverlay(props.trail, props.onToggleInfoOverlay) : null
);


export default TrailView;
