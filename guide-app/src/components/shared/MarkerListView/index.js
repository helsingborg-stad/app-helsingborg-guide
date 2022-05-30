// @flow
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  PixelRatio,
  Image,
  Text, StatusBar
} from "react-native";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import { Colors } from "@assets/styles";
import IconTextTouchable from "@shared-components/IconTextTouchable";
import SegmentControl from "@shared-components/SegmentControl";
import MapMarkerView from "@shared-components/MapMarkerView";
import LangService from "@services/langService";
import {
  LocationUtils,
  UrlUtils,
  MapItemUtils,
  NavigationModeUtils
} from "@utils";
import {
  selectCurrentContentObject,
  selectCurrentGuideGroup,
  selectCurrentGuide,
  selectCurrentSharingLink
} from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

import styles, { ListItemWidth, DefaultMargin, ScreenHeight } from "./styles";

type Props = {
  navigation: any,
  items: MapItem[],
  showNumberedMapMarkers: boolean,
  showDirections: boolean,
  userLocation: ?GeolocationType,
  supportedNavigationModes?: Array<string>,
  selectGuide(guide: Guide): void,
  selectGuideGroup(id: number): void,
  dispatchSelectContentObject(obj: ContentObject): void
};

const HalfListMargin = DefaultMargin * 0.5;

const MarkerListView = (props: Props) => {
  const { supportedNavigationModes, navigation, items, userLocation, keepStatusBar } = props;
  const params = navigation?.state?.params;
  const redirect = params?.redirect;

  const [selectedNavigationMode, setSelectedNavigationMode] = useState(supportedNavigationModes
    ? supportedNavigationModes[supportedNavigationModes.length - 1]
    : NavigationModeUtils.NavigationModes.Map);
  const [recentlyTappedPin, setRecentlyTappedPin] = useState(false);
  const [activeMarker, setActiveMarker] = useState("");
  const [showHorizontalList, setShowHorizontalList] = useState(true);
  const listRef = useRef();

  let mapMarkerViewRef = MapMarkerView;

  useEffect(() => {
    if (redirect && listRef.current && mapMarkerViewRef) {
      let index = -1;
      const currentItem = items.find((item, i) => {
        let result = (item?.contentObject.id?.toString() === redirect.toString() || item?.id?.toString() === redirect.toString());
        if (result) {
          index = i;
        }
        return result;
      });
      if (currentItem && index !== -1) {
        scrollToIndex(index);
        mapMarkerViewRef?.panMapToIndex(index);
        onListItemPressed(currentItem);
      } else {
        setTimeout(() => scrollToIndex(0), 100);
      }
    }
  }, [redirect, listRef, mapMarkerViewRef]);


  const getMapItemProps = (
    item: MapItem
  ): {
    title: ?string,
    streetAddress: ?string,
    thumbnailUrl: ?string
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
        thumbnailUrl
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
        thumbnailUrl
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
        thumbnailUrl
      };
    }

    return { title: null, streetAddress, thumbnailUrl };
  };

  const getInitialLocation = () => {
    const location = items
      .map(item => MapItemUtils.getLocationFromItem(item))
      .find(item => item != null);
    return location;
  };

  const onListItemPressed = (listItem: MapItem) => {
    const {
      navigation,
      selectGuideGroup,
      selectGuide,
      dispatchSelectContentObject,
      items,
      path,
      currentSharingLink,
      dispatchCurrentSharingLink
    } = props;
    const { navigate } = navigation;
    const { guide, guideGroup, contentObject } = listItem;
    let sharingLink = currentSharingLink;
    const currentScreen = navigation.state.routeName;
    if (guideGroup) {
      if (currentScreen === "HomeScreen") {
        sharingLink = `guidehbg://home/group/${guideGroup?.id}`;
      } else {
        sharingLink += `/${guideGroup?.id}`;
      }
      dispatchCurrentSharingLink(sharingLink);
      trackScreen("view_location", guideGroup?.slug);
      selectGuideGroup(guideGroup.id);
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
      dispatchCurrentSharingLink(sharingLink);
      trackScreen("view_guide", guide?.slug || "");
      selectGuide(guide);
      switch (guideType) {
        case "trail":
          navigate("TrailScreen", { title: guide.name, path: sharingLink });
          return;
        case "guide":
        default:
          navigate("GuideDetailsScreen", { title: guide.name, path: sharingLink });
          return;
      }
    }
    if (contentObject) {
      dispatchSelectContentObject(contentObject);
      let _items = [];
      items.map(item => _items.push(item?.contentObject));
      const newPath = `${path}/${contentObject?.title}`;
      trackScreen(newPath, newPath);
      sharingLink += `/${contentObject?.id}`;
      dispatchCurrentSharingLink(sharingLink);
      navigate("ObjectScreen", {
        title: contentObject?.title,
        array: _items,
        selectObject: dispatchSelectContentObject,
        order: contentObject.order,
        swipeable: true,
        scrollable: scrollToIndex,
        panToIndex: mapMarkerViewRef.panMapToIndex,
        path: newPath,
        ...(redirect && { redirect: redirect })
      });
    }
  };

  const onListItemDirectionsButtonPressed = (item: MapItem) => {
    const location = MapItemUtils.getLocationFromItem(item);
    if (!location) {
      return;
    }

    const { userLocation } = props;
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
    const { userLocation } = props;
    let hasArrived = false;
    let location = MapItemUtils.getLocationFromItem(item);

    if (userLocation && location) {
      hasArrived = LocationUtils.hasArrivedAtDestination(
        userLocation,
        location
      )}
      else {
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
    const { all } = props;
    const numberOfGuides = MapItemUtils.getNumberOfGuides(item, all);
    if (!numberOfGuides) {
      return null;
    }

    let textString;
    const plural = numberOfGuides > 1;

    const locationString = plural
      ? LangService.strings.LOCATIONS
      : LangService.strings.LOCATION;
    const mediaGuideString = plural
      ? LangService.strings.MEDIAGUIDES
      : LangService.strings.MEDIAGUIDE;

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
    const { userLocation } = props;

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

  const renderListItem = (item: MapItem, listItemStyle: any, number: number) => {
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
              {showNumberedMapMarkers
                ? displayNumberView(item, number)
                : null}
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

  const renderHorizontalList = (items: Array<MapItem>) => (
    items.length > 0 ? <FlatList
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
    /> : null
  );

  // iOS callback event when the list is changed
  const onListScroll = (e: any) => {
    const { items } = props;
    const xOffset = e.nativeEvent.contentOffset.x;
    const fullItemWidth = ListItemWidth + HalfListMargin;
    const index = Math.round(Math.abs(xOffset / fullItemWidth));

    if (!isEqual(activeMarker !== items[index])) {
      setActiveMarker(items[index]);
    }

    if (!recentlyTappedPin && mapMarkerViewRef) {
      mapMarkerViewRef.panMapToIndex(index);
    }
  };

  const scrollToIndex = index => {
    setRecentlyTappedPin(true);
    setActiveMarker(items[index]);
    if (listRef?.current) {
      const x = (ListItemWidth + DefaultMargin / 2) * index - 15;
      listRef.current.scrollToOffset({ offset: x });
    }
    // Setting a timeout to prevent map from "jumping" while panning
    setTimeout(() => {
      setRecentlyTappedPin(false);
    }, 1000);
  };

  const onNavigationModeChange = (index: number) => {
    const { supportedNavigationModes } = props;

    if (supportedNavigationModes) {
      const _selectedNavigationMode = supportedNavigationModes[index];
      setSelectedNavigationMode(_selectedNavigationMode);
    }
  };

  const initialLocation = getInitialLocation();

  return (
    <>
      {!keepStatusBar && <StatusBar
        barStyle={"light-content"}
        backgroundColor={Colors.themeSecondary}
      />}
      {navigation.isFocused() ?
        <View style={styles.container}>
          {supportedNavigationModes && supportedNavigationModes.length > 1 && (
            <SegmentControl
              style={styles.segmentControl}
              labels={supportedNavigationModes.map(
                mode => `${LangService.strings[mode]}`
              )}
              onSegmentIndexChange={onNavigationModeChange}
              initalSelectedIndex={supportedNavigationModes.indexOf(
                selectedNavigationMode
              )}
            />
          )}
          {selectedNavigationMode === NavigationModeUtils.NavigationModes.Map && (
            <MapMarkerView
              items={items}
              ref={ref => {
                mapMarkerViewRef = ref;
              }}
              userLocation={userLocation}
              showNumberedMapMarkers
              onMapMarkerPressed={index => {
                scrollToIndex(index);
              }}
              activeMarker={activeMarker}
              initialLocation={initialLocation}
              navigation={navigation}
              setActiveMarker={setActiveMarker}
              scrollToIndex={scrollToIndex}
            />
          )}

          {!showHorizontalList ||
          selectedNavigationMode === NavigationModeUtils.NavigationModes.AR ||
          renderHorizontalList(items)}
        </View> : <></>}
    </>
  );
};

function mapStateToProps(state: RootState) {
  const { geolocation, uiState, guides } = state;
  const { currentSharingLink } = uiState;
  const { all } = guides;

  return {
    userLocation: geolocation?.position,
    currentSharingLink,
    all
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: contentObject =>
      dispatch(selectCurrentContentObject(contentObject)),
    selectGuideGroup: id => dispatch(selectCurrentGuideGroup(id)),
    selectGuide: guide => dispatch(selectCurrentGuide(guide)),
    dispatchCurrentSharingLink: (link: string) => dispatch(selectCurrentSharingLink(link))
  };
}

MarkerListView.defaultProps = {
  supportedNavigationModes: [NavigationModeUtils.NavigationModes.Map]
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkerListView);
