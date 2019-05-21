// @flow
import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, Dimensions, PixelRatio, Image, Text } from "react-native";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import IconTextTouchable from "../IconTextTouchable";
import SegmentControl from "../SegmentControl";
import MapMarkerView from "../MapMarkerView";
import LangService from "../../../services/langService";
import { LocationUtils, UrlUtils, AnalyticsUtils, MapItemUtils, NavigationModeUtils } from "../../../utils";
import { selectCurrentContentObject, selectCurrentGuideGroup, selectCurrentGuide } from "../../../actions/uiStateActions";
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
  dispatchSelectContentObject(obj: ContentObject): void,
};
type State = {
  selectedNavigationMode: string,
  recentlyTappedPin: boolean,
  activeMarker: MapItem,
};

class MarkerListView extends Component<Props, State> {
  static defaultProps = {
    supportedNavigationModes: [NavigationModeUtils.NavigationModes.Map],
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedNavigationMode: props.supportedNavigationModes[0],
      recentlyTappedPin: false,
      activeMarker: props.items[0],
    };
  }

  listRef: ?FlatList<MapItem>;

  mapMarkerViewRef: ?MapMarkerView;

  getMapItemProps = (
    item: MapItem,
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

  getItemLayout = (data: any, index: number) => ({
    length: ListItemWidth,
    offset: (ListItemWidth + DefaultMargin / 2) * index,
    index,
  });

  onListItemPressed = (listItem: MapItem) => {
    const { navigation, selectGuideGroup, selectGuide, dispatchSelectContentObject } = this.props;
    const { navigate } = navigation;
    const { guide, guideGroup, contentObject } = listItem;
    if (guideGroup) {
      AnalyticsUtils.logEvent("view_location", { name: guideGroup.slug });
      selectGuideGroup(guideGroup.id);
      navigate("LocationScreen", { title: guideGroup.name });
      return;
    }

    if (guide) {
      const { guideType } = guide;
      AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
      selectGuide(guide);

      switch (guideType) {
        case "trail":
          navigate("TrailScreen", { title: guide.name });
          return;
        case "guide":
        default:
          navigate("GuideDetailsScreen", { title: guide.name });
          return;
      }
    }

    if (contentObject) {
      dispatchSelectContentObject(contentObject);
      AnalyticsUtils.logEvent("view_object", { name: contentObject.title });
      navigate("ObjectScreen", {
        title: contentObject.title,
      });
    }
  };

  onListItemDirectionsButtonPressed = (item: MapItem) => {
    const location = MapItemUtils.getLocationFromItem(item);
    if (!location) return;

    const { userLocation } = this.props;
    const { latitude, longitude } = location;
    const directionsUrl = LocationUtils.directionsUrl(latitude, longitude, userLocation);
    UrlUtils.openUrlIfValid(directionsUrl, LangService.strings.OPEN_IN_MAPS, "", LangService.strings.CANCEL, LangService.strings.OPEN);
  };

  displayNumberView = (item: MapItem, index: number) => {
    const numberString = `${index}`;
    const numberView = (
      <View style={styles.listImageNumberView}>
        <Text style={styles.listImageNumberText}>{numberString}</Text>
      </View>
    );

    return numberView;
  };

  displayGuideNumber = (item: MapItem) => {
    const numberOfGuides = MapItemUtils.getNumberOfGuides(item);
    if (!numberOfGuides) return null;

    let textString;
    const plural = numberOfGuides > 1;

    const locationString = plural ? LangService.strings.LOCATIONS : LangService.strings.LOCATION;
    const mediaGuideString = plural ? LangService.strings.MEDIAGUIDES : LangService.strings.MEDIAGUIDE;
    const isAccessibility = PixelRatio.getFontScale() > 1;

    const { guide, guideGroup } = item;
    if (guideGroup) {
      textString = `${numberOfGuides} ${mediaGuideString.toLowerCase()}`;
    } else if (guide) {
      const { guideType } = guide;
      if (guideType === "trail") {
        if (isAccessibility) {
          textString = `${numberOfGuides} ${locationString}`;
        } else {
          textString = `${LangService.strings.TOUR} ${LangService.strings.WITH} ${numberOfGuides} ${locationString}`;
        }
      } else if (guideType === "guide") {
        if (isAccessibility) {
          textString = `${numberOfGuides} ${LangService.strings.OBJECT}`;
        } else {
          textString = `${LangService.strings.MEDIAGUIDE} ${LangService.strings.WITH} ${numberOfGuides} ${LangService.strings.OBJECT}`;
        }
      }
    }

    return <Text style={styles.guideNumberText}>{textString}</Text>;
  };

  renderListItem = (item: MapItem, listItemStyle: any, number: number) => {
    const { title, streetAddress, thumbnailUrl } = this.getMapItemProps(item);
    const { showDirections, showNumberedMapMarkers } = this.props;
    const titleLineCount = ScreenHeight > 600 && PixelRatio.getFontScale() === 1 ? 2 : 1;

    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(item)}>
        <View style={listItemStyle}>
          {thumbnailUrl && <Image style={styles.listImage} source={{ uri: thumbnailUrl }} />}
          {showNumberedMapMarkers ? this.displayNumberView(item, number) : null}
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemTitle} numberOfLines={titleLineCount}>
              {title}
            </Text>
            <Text style={styles.listItemAddress} numberOfLines={1}>
              {streetAddress}
            </Text>
            {showDirections ? (
              <IconTextTouchable
                iconName="directions"
                text={LangService.strings.DIRECTIONS}
                onPress={() => this.onListItemDirectionsButtonPressed(item)}
              />
            ) : null}
            {this.displayGuideNumber(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderHorizontalList = (items: Array<MapItem>) => (
    <FlatList
      contentInset={{ left: 10, top: 0, bottom: 0, right: 10 }}
      data={items}
      horizontal
      keyExtractor={MapItemUtils.getIdFromMapItem}
      ref={(ref) => {
        this.listRef = ref;
      }}
      renderItem={({ item, index }) => this.renderListItem(item, styles.listItem, index + 1)}
      style={styles.listStyle}
      getItemLayout={this.getItemLayout}
      onMomentumScrollEnd={this.onListScroll}
      snapToAlignment="center"
      snapToInterval={ListItemWidth + 10}
      decelerationRate="fast"
      scrollEventThrottle={300}
      swipeEnabled
    />
  );

  // iOS callback event when the list is changed
  onListScroll = (e: any) => {
    const { recentlyTappedPin, activeMarker } = this.state;
    const { items } = this.props;
    const xOffset = e.nativeEvent.contentOffset.x;
    const fullItemWidth = ListItemWidth + DefaultMargin / 2;
    const index = Math.round(Math.abs(xOffset / fullItemWidth));

    if (!isEqual(activeMarker !== items[index])) {
      this.setState({ activeMarker: items[index] });
    }

    if (!recentlyTappedPin && this.mapMarkerViewRef) {
      this.mapMarkerViewRef.panMapToIndex(index);
    }
  };

  scrollToIndex = (index) => {
    const { items } = this.props;
    this.setState({ recentlyTappedPin: true, activeMarker: items[index] });

    if (this.listRef) {
      const x = (ListItemWidth + DefaultMargin / 2) * index - 15;
      this.listRef.scrollToOffset({ offset: x });
    }

    // Setting a timeout to prevent map from "jumping" while panning
    setTimeout(() => {
      this.setState({ recentlyTappedPin: false });
    }, 1000);
  };

  onNavigationModeChange = (index: number) => {
    const { supportedNavigationModes } = this.props;
    this.setState({ selectedNavigationMode: supportedNavigationModes[index] });
  };

  render() {
    const { items, supportedNavigationModes, userLocation } = this.props;
    const { selectedNavigationMode, activeMarker } = this.state;

    return (
      <View style={styles.container}>
        {supportedNavigationModes.length > 1 && (
          <SegmentControl
            labels={supportedNavigationModes.map(mode => `${LangService.strings[mode]}`)}
            onSegmentIndexChange={this.onNavigationModeChange}
          />
        )}
        {selectedNavigationMode === NavigationModeUtils.NavigationModes.Map && (
          <MapMarkerView
            items={items}
            ref={(ref) => {
              this.mapMarkerViewRef = ref;
            }}
            userLocation={userLocation}
            showNumberedMapMarkers
            onMapMarkerPressed={index => this.scrollToIndex(index)}
            activeMarker={activeMarker}
          />
        )}
        {this.renderHorizontalList(items)}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { geolocation } = state;
  return {
    userLocation: geolocation,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: contentObject => dispatch(selectCurrentContentObject(contentObject)),
    selectGuideGroup: id => dispatch(selectCurrentGuideGroup(id)),
    selectGuide: guide => dispatch(selectCurrentGuide(guide)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkerListView);
