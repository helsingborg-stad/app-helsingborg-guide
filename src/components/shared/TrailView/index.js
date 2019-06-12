// @flow
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { NavigationModeUtils } from "../../../utils";
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

const createMockItem = (location: Location, index: number): MapItem => ({
  contentObject: {
    id: index.toString(),
    order: index,
    postStatus: "publish",
    searchableId: `test_${index}`,
    title: `Test item ${index}`,
    description: "Test",
    images: [{ thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Sofiero_Fassade.JPG/300px-Sofiero_Fassade.JPG" }],
    location,
  },
});
const mockLocations = [
  {
    id: 1,
    streetAddress: "ustwo Malmö",
    latitude: 55.599033,
    longitude: 13.000497,
    openingHours: [
      {
        closed: true,
        closing: "",
        dayNumber: 1,
        opening: "",
        weekday: "",
      },
    ],
    openingHourExceptions: [
      {
        date: "",
        description: "",
      },
    ],
    links: [
      {
        service: "",
        url: "",
      },
    ],
  },
  {
    id: 2,
    streetAddress: "Victoriateatern",
    latitude: 55.599314,
    longitude: 13.001245,
    openingHours: [
      {
        closed: true,
        closing: "",
        dayNumber: 1,
        opening: "",
        weekday: "",
      },
    ],
    openingHourExceptions: [
      {
        date: "",
        description: "",
      },
    ],
    links: [
      {
        service: "",
        url: "",
      },
    ],
  },
  {
    id: 3,
    streetAddress: "SF-Bokhandeln",
    latitude: 55.598275,
    longitude: 13.001262,
    openingHours: [
      {
        closed: true,
        closing: "",
        dayNumber: 1,
        opening: "",
        weekday: "",
      },
    ],
    openingHourExceptions: [
      {
        date: "",
        description: "",
      },
    ],
    links: [
      {
        service: "",
        url: "",
      },
    ],
  },
  {
    id: 4,
    streetAddress: "Biograf Royal",
    latitude: 55.601554,
    longitude: 13.000977,
    openingHours: [
      {
        closed: true,
        closing: "",
        dayNumber: 1,
        opening: "",
        weekday: "",
      },
    ],
    openingHourExceptions: [
      {
        date: "",
        description: "",
      },
    ],
    links: [
      {
        service: "",
        url: "",
      },
    ],
  },
];

const mockItems = mockLocations.map(createMockItem);

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
        items={mockItems}
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
