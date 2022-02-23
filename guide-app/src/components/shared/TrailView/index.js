// @flow
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { NavigationModeUtils } from "@utils";
import styles from "./style";
import MarkerListView from "@shared-components/MarkerListView";
import MapInformationOverlay from "@shared-components/MapInformationOverlay/MapInformationOverlay";
import AudioPlayerView from "@shared-components/AudioPlayerView";
import DownloadButtonContainer from "@shared-components/DownloadButton";

type Props = {
  items: any,
  trail: Guide,
  onListItemPressed: any,
  showInfoOverlay: boolean,
  onToggleInfoOverlay: () => void,
  navigation: Object
};

function renderDownloadButton() {
  return <DownloadButtonContainer style={styles.downloadButton} />;
}

function renderMapInformationOverlay(
  trail: Guide,
  onToggleInfoOverlay: () => void
) {
  console.log("le trail", trail)
  if (!trail) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onToggleInfoOverlay}>
      <MapInformationOverlay
        trailInformation={{
          title: trail.name,
          description: trail.description,
          image: trail.images
        }}
        onPressFunction={onToggleInfoOverlay}
        downloadComponent={renderDownloadButton}
      />
    </TouchableWithoutFeedback>
  );
}

const TrailView = (props: Props) => {
  const { items, trail, onListItemPressed, onToggleInfoOverlay, showInfoOverlay, navigation, path, redirect } = props;
  
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <MarkerListView
          items={items}
          path={path}
          showNumberedMapMarkers
          showDirections
          onListItemPressed={onListItemPressed}
          // NOTE: this disables checking for AR mode
          // supportedNavigationModes={NavigationModeUtils.navigationModesForGuide(
          //   trail
          // )}
          navigation={navigation}
          redirect={redirect}
        />
        {showInfoOverlay
          ? renderMapInformationOverlay(trail, onToggleInfoOverlay)
          : null}
        <AudioPlayerView />
      </View>
    </View>
  );
};

export default TrailView;
