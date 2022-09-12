// @flow
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  PixelRatio,
  Image,
  Text,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { Colors } from "@assets/styles";
import { useRoute } from "@react-navigation/native";
import IconTextTouchable from "@shared-components/IconTextTouchable";
import SegmentControl from "@shared-components/SegmentControl";
import MapMarkerView from "@shared-components/MapMarkerView";
import LangService from "@services/langService";
import {
  LocationUtils,
  UrlUtils,
  MapItemUtils,
  NavigationModeUtils,
} from "@utils";
import {
  selectCurrentContentObject,
  selectCurrentGuideGroup,
  selectCurrentGuide,
  selectCurrentSharingLink,
} from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

import styles, { ListItemWidth, DefaultMargin, ScreenHeight } from "./styles";

type Props = {
  navigation: any,
  route: any,
  items: MapItem[],
  showNumberedMapMarkers: boolean,
  showDirections: boolean,
  userLocation: ?GeolocationType,
  supportedNavigationModes?: Array<string>,
  path: String,
  keepStatusBar: Boolean,
  currentSharingLink: String,
  dispatchCurrentSharingLink: any,
  all: any,
};

const HalfListMargin = DefaultMargin * 0.5;

const MarkerListView = (props: Props) => {
  const { supportedNavigationModes, navigation, route, items, keepStatusBar } =
    props;
  const params = route?.params;
  const redirect = params?.redirect;
  const _route = useRoute();

  const [selectedNavigationMode, setSelectedNavigationMode] = useState(
    supportedNavigationModes
      ? supportedNavigationModes[supportedNavigationModes.length - 1]
      : NavigationModeUtils.NavigationModes.Map
  );
  const [recentlyTappedPin, setRecentlyTappedPin] = useState(false);
  const [activeMarker, setActiveMarker] = useState("");
  const [showHorizontalList] = useState(true);
  const listRef = useRef();
  const map = useRef(null);
  const [longitudeDelta, setLongitudeDelta] = useState(0);
  let [latitudeDelta, setLatitudeDelta] = useState(0);
  const dispatch = useDispatch();
  const userLocation = useSelector((s) => s.geolocation?.position) || {};
  const { currentSharingLink } = useSelector((s) => s.uiState) || {};
  const { all } = useSelector((s) => s.guides) || {};

  useEffect(() => {
    if (redirect && listRef.current && map.current) {
      let index = -1;
      const currentItem = items.find((item, i) => {
        let result =
          item?.contentObject.id?.toString() === redirect.toString() ||
          item?.id?.toString() === redirect.toString();
        if (result) {
          index = i;
        }
        return result;
      });
      if (currentItem && index !== -1) {
        scrollToIndex(index);
        panMapToIndex(index);
        onListItemPressed(currentItem);
      } else {
        setTimeout(() => scrollToIndex(0), 100);
      }
    }
  }, [redirect, listRef, map]);

  const getMapItemProps = (
    item: MapItem
  ): {
    title: ?string,
    streetAddress: ?string,
    thumbnailUrl: ?string,
  } => {
    const { contentObject, guide, guideGroup } = item;
    let streetAddress = null;
    let thumbnailUrl = null;
    if (contentObject) {
      const { title, location, images } = contentObject;
      if (location) {
        ({ streetAddress } = location);
      }
      if (images.length > 0) {
        thumbnailUrl = images[0].thumbnail;
      }
      return {
        title,
        streetAddress,
        thumbnailUrl,
      };
    }

    if (guide) {
      const { name: title, location, images } = guide;
      if (location) {
        ({ streetAddress } = location);
      }
      thumbnailUrl = images.thumbnail;
      return {
        title,
        streetAddress,
        thumbnailUrl,
      };
    }

    if (guideGroup) {
      const { name: title, location, images } = guideGroup;
      if (location) {
        ({ streetAddress } = location);
      }
      thumbnailUrl = images.thumbnail;
      return {
        title,
        streetAddress,
        thumbnailUrl,
      };
    }

    return { title: null, streetAddress, thumbnailUrl };
  };

  const getInitialLocation = () => {
    const location = items
      .map((item) => MapItemUtils.getLocationFromItem(item))
      .find((item) => item != null);
    return location;
  };

  const panMapToIndex = (index: number) => {
    const marker = items[index];
    if (marker !== activeMarker) {
      const location = MapItemUtils.getLocationFromItem(marker);
      if (map.current && location) {
        map.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
    }
  };

  const onListItemPressed = (listItem: MapItem) => {
    const { path } = props;
    const { navigate } = navigation;
    const { guide, guideGroup, contentObject } = listItem;
    let sharingLink = currentSharingLink;
    const currentScreen = _route.name;
    if (guideGroup) {
      if (currentScreen === "HomeScreen") {
        sharingLink = `guidehbg://home/group/${guideGroup?.id}`;
      } else {
        sharingLink += `/${guideGroup?.id}`;
      }
      dispatch(selectCurrentSharingLink(sharingLink)),
        trackScreen("view_location", guideGroup?.slug);
      dispatch(selectCurrentGuideGroup(guideGroup.id));
      navigate("LocationScreen", { title: guideGroup.name, path: sharingLink });
      return;
    }
    if (guide) {
      const { guideType } = guide;
      if (currentScreen === "HomeScreen") {
        sharingLink = `guidehbg://home/guide/${guide?.id}`;
      } else {
        sharingLink += `/${guide?.id}`;
      }
      dispatch(selectCurrentSharingLink(sharingLink)),
        trackScreen("view_guide", guide?.slug || "");
      dispatch(selectCurrentGuide(guide));
      switch (guideType) {
        case "trail":
          navigate("TrailScreen", { title: guide.name, path: sharingLink });
          return;
        case "guide":
        default:
          navigate("GuideDetailsScreen", {
            title: guide.name,
            path: sharingLink,
          });
          return;
      }
    }
    if (contentObject) {
      dispatch(selectCurrentContentObject(contentObject));
      let _items = [];
      items.map((item) => _items.push(item?.contentObject));
      const newPath = `${path}/${contentObject?.title}`;
      trackScreen(newPath, newPath);
      sharingLink += `/${contentObject?.id}`;
      dispatch(selectCurrentSharingLink(sharingLink));
      navigate("ObjectScreen", {
        title: contentObject?.title,
        array: _items,
        selectObject: (obj) => dispatch(selectCurrentContentObject(obj)),
        order: contentObject.order,
        swipeable: true,
        scrollable: scrollToIndex,
        panToIndex: panMapToIndex,
        path: newPath,
        merge: true,
        ...(redirect && { redirect: redirect }),
      });
    }
  };

  const onListItemDirectionsButtonPressed = (item: MapItem) => {
    const location = MapItemUtils.getLocationFromItem(item);
    if (!location) {
      return;
    }

    const { latitude, longitude } = location;
    const directionsUrl = LocationUtils.directionsUrl(
      latitude,
      longitude,
      userLocation
    );
    UrlUtils.openUrlIfValid(
      directionsUrl,
      LangService.strings.OPEN_IN_MAPS,
      "",
      LangService.strings.CANCEL,
      LangService.strings.OPEN
    );
  };

  const displayNumberView = (item: MapItem, index: number) => {
    const numberString = `${index}`;
    let hasArrived = false;
    let location = MapItemUtils.getLocationFromItem(item);

    if (userLocation && location) {
      hasArrived = LocationUtils.hasArrivedAtDestination(
        userLocation,
        location
      );
    } else {
      hasArrived = false;
    }

    const numberView = (
      <View
        style={
          hasArrived
            ? styles.listImageNumberViewArrived
            : styles.listImageNumberView
        }
      >
        <Text style={styles.listImageNumberText}>{numberString}</Text>
      </View>
    );

    return numberView;
  };

  const displayGuideNumber = (item: MapItem) => {
    const numberOfGuides = MapItemUtils.getNumberOfGuides(item, all);
    if (!numberOfGuides) {
      return null;
    }
    let textString;
    const { guide, guideGroup } = item;
    if (guideGroup) {
      textString = `${numberOfGuides} ${LangService.strings.EXPERIENCES.toLowerCase()}`;
    } else if (guide) {
      const { guideType } = guide;
      if (guideType === "trail") {
        textString = `${numberOfGuides} ${LangService.strings.EXPERIENCES.toLowerCase()}`;
      } else if (guideType === "guide") {
        textString = `${numberOfGuides} ${LangService.strings.EXPERIENCES.toLowerCase()}`;
      }
    }

    return <Text style={styles.guideNumberText}>{textString}</Text>;
  };

  const renderDirections = (item: MapItem) => (
    <IconTextTouchable
      iconName="directions"
      text={LangService.strings.DIRECTIONS}
      onPress={() => onListItemDirectionsButtonPressed(item)}
    />
  );

  const renderEstimates = (item: MapItem) => {
    const location = MapItemUtils.getLocationFromItem(item);

    if (!location || !userLocation) {
      return null;
    }

    const { coords } = userLocation;
    const distance = Math.round(
      LocationUtils.getTravelDistance(coords, location)
    );
    const time = Math.round(LocationUtils.getTravelTime(distance));

    const min = LangService.strings.MINUTE;
    const hour = LangService.strings.HOUR;

    return (
      <View style={styles.listEstimatesContainer}>
        <Text style={styles.listEstimatesDistance}>
          {distance < 1000
            ? `${distance} m`
            : `${Math.round(distance / 1000)} km`}
        </Text>
        <Text style={styles.listEstimatesTime}>
          {(time > 60 && `>1 ${hour}`) ||
            (time > 1 && `${time} ${min}`) ||
            `<1 ${min}`}
        </Text>
      </View>
    );
  };

  const renderListItem = (
    item: MapItem,
    listItemStyle: any,
    number: number
  ) => {
    const { showDirections, showNumberedMapMarkers } = props;

    const { title, streetAddress, thumbnailUrl } = getMapItemProps(item);
    const showEstimates =
      selectedNavigationMode === NavigationModeUtils.NavigationModes.AR;
    const titleLineCount =
      ScreenHeight > 600 && PixelRatio.getFontScale() === 1 && !showEstimates
        ? 2
        : 1;

    return (
      <TouchableOpacity onPress={() => onListItemPressed(item)}>
        <View style={listItemStyle}>
          {thumbnailUrl && (
            <Image style={styles.listImage} source={{ uri: thumbnailUrl }} />
          )}
          <View style={styles.listItemTextContainer}>
            <View style={styles.listItemTitleContainer}>
              <Text style={styles.listItemTitle} numberOfLines={1}>
                {title}
              </Text>
              {showNumberedMapMarkers ? displayNumberView(item, number) : null}
            </View>
            <Text style={styles.listItemAddress} numberOfLines={titleLineCount}>
              {streetAddress}
            </Text>
            {(showEstimates && renderEstimates(item)) ||
              (showDirections && renderDirections(item)) ||
              null}
            {displayGuideNumber(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHorizontalList = (items: Array<MapItem>) =>
    items.length > 0 ? (
      <FlatList
        contentInset={{ left: 20, top: 0, bottom: 0, right: 20 }}
        contentContainerStyle={styles.listContainerStyle}
        data={items}
        horizontal
        keyExtractor={MapItemUtils.getIdFromMapItem}
        ref={(ref) => {
          listRef.current = ref;
        }}
        renderItem={({ item, index }) =>
          renderListItem(item, styles.listItem, index + 1)
        }
        style={styles.listStyle}
        onMomentumScrollEnd={onListScroll}
        snapToAlignment="center"
        snapToInterval={ListItemWidth + HalfListMargin}
        decelerationRate="fast"
        scrollEventThrottle={300}
        swipeEnabled
        initialNumToRender={items.length}
      />
    ) : null;

  // iOS callback event when the list is changed
  const onListScroll = (e: any) => {
    const xOffset = e.nativeEvent.contentOffset.x;
    const fullItemWidth = ListItemWidth + HalfListMargin;
    const index = Math.round(Math.abs(xOffset / fullItemWidth));

    if (!isEqual(activeMarker !== items[index])) {
      setActiveMarker(items[index]);
    }

    if (!recentlyTappedPin && map.current) {
      panMapToIndex(index);
    }
  };

  const scrollToIndex = (index) => {
    setRecentlyTappedPin(true);
    setActiveMarker(items[index]);
    if (listRef?.current) {
      const x = (ListItemWidth + DefaultMargin / 2) * index - 15;
      listRef.current.scrollToOffset({ offset: x });
    }
    // Setting a timeout to prevent map from "jumping" while panning
    navigation.isFocused() &&
      setTimeout(() => {
        setRecentlyTappedPin(false);
      }, 1000);
  };

  const onNavigationModeChange = (index: number) => {
    if (supportedNavigationModes) {
      const _selectedNavigationMode = supportedNavigationModes[index];
      setSelectedNavigationMode(_selectedNavigationMode);
    }
  };

  const initialLocation = getInitialLocation();

  return (
    <>
      {!keepStatusBar && (
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={Colors.themeSecondary}
        />
      )}
      {navigation.isFocused() ? (
        <View style={styles.container}>
          {supportedNavigationModes && supportedNavigationModes.length > 1 && (
            <SegmentControl
              style={styles.segmentControl}
              labels={supportedNavigationModes.map(
                (mode) => `${LangService.strings[mode]}`
              )}
              onSegmentIndexChange={onNavigationModeChange}
              initalSelectedIndex={supportedNavigationModes.indexOf(
                selectedNavigationMode
              )}
            />
          )}
          {selectedNavigationMode ===
            NavigationModeUtils.NavigationModes.Map && (
            <MapMarkerView
              items={items}
              // ref={(ref) => {
              //   mapMarkerViewRef = ref;
              // }}
              map={map}
              userLocation={userLocation}
              showNumberedMapMarkers
              onMapMarkerPressed={(index) => {
                scrollToIndex(index);
              }}
              activeMarker={activeMarker}
              initialLocation={initialLocation}
              navigation={navigation}
              setActiveMarker={setActiveMarker}
              scrollToIndex={scrollToIndex}
              panMapToIndex={panMapToIndex}
              longitudeDelta={longitudeDelta}
              latitudeDelta={latitudeDelta}
              setLongitudeDelta={setLongitudeDelta}
              setLatitudeDelta={setLatitudeDelta}
            />
          )}

          {!showHorizontalList ||
            selectedNavigationMode === NavigationModeUtils.NavigationModes.AR ||
            renderHorizontalList(items)}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

MarkerListView.defaultProps = {
  supportedNavigationModes: [NavigationModeUtils.NavigationModes.Map],
};

export default MarkerListView;
