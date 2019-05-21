// @flow

import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { NavigationModeUtils } from "src/utils";
import styles from "./style";
import MarkerListView from "../MarkerListView";
import MapInformationOverlay from "../MapInformationOverlay/MapInformationOverlay";
import AudioPlayerView from "../AudioPlayerView";
import DownloadButtonContainer from "../DownloadButton";

type Props = {
  trail: Guide,
  showInfoOverlay: boolean,
  onToggleInfoOverlay: () => void,
  navigation: Object,
};

function renderDownloadButton() {
  return <DownloadButtonContainer style={styles.downloadButton} />;
}

function renderMapInformationOverlay(trail: Guide, onToggleInfoOverlay: () => void) {
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

const TrailView = (props: Props) => {
  const { trail, onToggleInfoOverlay, showInfoOverlay, navigation } = props;
  const mapItems: MapItem[] = trail.contentObjects.map(item => ({
    contentObject: item,
  }));

  return (
    <View style={styles.container}>
      <MarkerListView
        items={mapItems}
        initialLocation={trail.contentObjects[0].location}
        showNumberedMapMarkers
        showDirections
        supportedNavigationModes={NavigationModeUtils.navigationModesForGuide(trail)}
        navigation={navigation}
      />
      {showInfoOverlay ? renderMapInformationOverlay(trail, onToggleInfoOverlay) : null}
      <AudioPlayerView />
    </View>
  );
};

export default TrailView;
