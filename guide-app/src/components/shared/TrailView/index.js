// @flow
import React, { memo } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
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
  navigation: Object,
  route: string,
  path: string,
  redirect: any,
  disableShare: Boolean,
};

function renderDownloadButton() {
  return <DownloadButtonContainer style={styles.downloadButton} />;
}

function renderMapInformationOverlay(
  trail: Guide,
  onToggleInfoOverlay: () => void,
  disableShare: Boolean,
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
        disableShare={disableShare}
      />
    </TouchableWithoutFeedback>
  );
}

const TrailView = (props: Props) => {
  const {
    items,
    trail,
    onListItemPressed,
    onToggleInfoOverlay,
    showInfoOverlay,
    navigation,
    route,
    path,
    redirect,
    disableShare,
  } = props;

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
          route={route}
          redirect={redirect}
        />
        {showInfoOverlay
          ? renderMapInformationOverlay(trail, onToggleInfoOverlay, disableShare)
          : null}
        <AudioPlayerView />
      </View>
    </View>
  );
};

export default memo(TrailView);
