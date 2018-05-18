// @flow

import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import styles from "./style";

import MapInformationOverlay from "../../shared/MapInformationOverlay";


type Props = {
  trailInformation: Object,
  showInfoOverlay: boolean,
  onToggleInfoOverlay: () => (void),
}

function renderMapInformationOverlay(trailInformation: Object, onToggleInfoOverlay: () => (void)) {
  return (
    <TouchableWithoutFeedback
      onPress={onToggleInfoOverlay}
    >
      <MapInformationOverlay
        trailInformation={trailInformation}
        onPressFunction={onToggleInfoOverlay}
      />
    </TouchableWithoutFeedback>
  );
}


const TrailView = (props: Props) => (
  props.showInfoOverlay ? renderMapInformationOverlay(props.trailInformation, props.onToggleInfoOverlay) : null
);


export default TrailView;
