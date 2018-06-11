// @flow

import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import styles from "./style";
import MapWithListView from "../../shared/MapWithListView";
import MapInformationOverlay from "../../shared/MapInformationOverlay";
import AudioPlayerView from "../AudioPlayerView";
import DownloadButtonContainer from "../DownloadButton";

type Props = {
  trail: Guide,
  showInfoOverlay: boolean,
  trailItems: Object[],
  onToggleInfoOverlay: () => void,
  navigation: Object
};

function renderDownloadButton() {
  return <DownloadButtonContainer style={styles.downloadButton} />;
}

function renderMapInformationOverlay(
  trail: Guide,
  onToggleInfoOverlay: () => void,
) {
  if (!trail) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onToggleInfoOverlay}>
      <MapInformationOverlay
        trailInformation={{
          title: trail.name,
          description: trail.description,
          image: trail.images,
        }}
        onPressFunction={onToggleInfoOverlay}
        downloadComponent={renderDownloadButton}
      />
    </TouchableWithoutFeedback>
  );
}

const TrailView = (props: Props) => (
  <View style={styles.container}>
    <MapWithListView
      items={props.trailItems}
      initialLocation={props.trailItems[0].location}
      navigation={props.navigation}
      stopAudioOnUnmount
      id={props.trail.id}
    />
    {props.showInfoOverlay
      ? renderMapInformationOverlay(props.trail, props.onToggleInfoOverlay)
      : null}
    <AudioPlayerView />
  </View>
);

export default TrailView;
