// @flow
import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, PixelRatio, Image, Text, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import IconTextTouchable from "../IconTextTouchable";
import SegmentControl from "../SegmentControl";
import { SegmentControlHeight } from "../SegmentControl/styles";
import MapMarkerView from "../MapMarkerView";
import ARView from "../ARView";
import LangService from "../../../services/langService";
import LocationService from "../../../services/locationService";
import { LocationUtils, UrlUtils, AnalyticsUtils, MapItemUtils, NavigationModeUtils } from "../../../utils";
import { selectCurrentContentObject, selectCurrentGuideGroup, selectCurrentGuide } from "../../../actions/uiStateActions";
import { AR_INSTRUCTIONS_SHOWN } from "../../../lib/my_consts";
import UsageModal from "./UsageModal";
import styles, { ListItemWidth, DefaultMargin, ScreenHeight, ListHeight, ListBottomMargin } from "./styles";

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
  shouldShowInstructions: boolean
};

const HalfListMargin = DefaultMargin * 0.5;

class MarkerListView extends Component<Props, State> {
  static defaultProps = {
    supportedNavigationModes: [NavigationModeUtils.NavigationModes.Map],
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedNavigationMode: props.supportedNavigationModes ? props.supportedNavigationModes[0] : NavigationModeUtils.NavigationModes.Map,
      recentlyTappedPin: false,
      activeMarker: props.items[0],
      shouldShowInstructions: false,
    };
  }

  componentDidMount() {
    this.scrollToIndex(0);

    AsyncStorage.getItem(AR_INSTRUCTIONS_SHOWN).then((value) => {
      this.setState({
        shouldShowInstructions: value ? JSON.parse(value) : true,
      });
    });
  }

  closeInstructions = () => {
    AsyncStorage.setItem(AR_INSTRUCTIONS_SHOWN, JSON.stringify(false));
    this.setState({ shouldShowInstructions: false });
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
    length: ListItemWidth + DefaultMargin,
    offset: (ListItemWidth + HalfListMargin) * index,
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

  renderDirections = (item: MapItem) => (
    <IconTextTouchable
      iconName="directions"
      text={LangService.strings.DIRECTIONS}
      onPress={() => this.onListItemDirectionsButtonPressed(item)}
    />
  );

  renderEstimates = (item: MapItem) => {
    const location = MapItemUtils.getLocationFromItem(item);
    const { userLocation } = this.props;

    if (!location || !userLocation) return null;

    const { coords } = userLocation;
    const distance = Math.round(LocationService.getTravelDistance(coords, location));
    const time = Math.round(LocationService.getTravelTime(distance));

    const min = LangService.strings.MINUTE;
    const hour = LangService.strings.HOUR;

    return (
      <View style={styles.listEstimatesContainer}>
        <Text style={styles.listEstimatesDistance}>
          {distance < 1000 ? `${distance} m` : `${Math.round(distance / 1000)} km`}
        </Text>
        <Text style={styles.listEstimatesTime}>
          { (time > 60 && `>1 ${hour}`) || (time > 1 && `${time} ${min}`) || (`<1 ${min}`) }
        </Text>
      </View>
    );
  };

  renderListItem = (item: MapItem, listItemStyle: any, number: number) => {
    const {
      props: { showDirections, showNumberedMapMarkers },
      state: { selectedNavigationMode },
    } = this;
    const { title, streetAddress, thumbnailUrl } = this.getMapItemProps(item);
    const showEstimates = selectedNavigationMode === NavigationModeUtils.NavigationModes.AR;
    const titleLineCount = ScreenHeight > 600 && PixelRatio.getFontScale() === 1 && !showEstimates ? 2 : 1;

    return (
      <TouchableOpacity onPress={() => this.onListItemPressed(item)}>
        <View style={listItemStyle}>
          {thumbnailUrl && <Image style={styles.listImage} source={{ uri: thumbnailUrl }} />}
          <View style={styles.listItemTextContainer}>
            <View style={styles.listItemTitleContainer}>
              <Text style={styles.listItemTitle} numberOfLines={1}>
                {title}
              </Text>
              {showNumberedMapMarkers ? this.displayNumberView(item, number) : null}
            </View>
            <Text style={styles.listItemAddress} numberOfLines={titleLineCount}>
              {streetAddress}
            </Text>
            { (showEstimates && this.renderEstimates(item)) || (showDirections && this.renderDirections(item)) || null }
            {this.displayGuideNumber(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderHorizontalList = (items: Array<MapItem>) => (
    <FlatList
      contentInset={{ left: 20, top: 0, bottom: 0, right: 20 }}
      contentContainerStyle={styles.listContainerStyle}
      data={items}
      horizontal
      keyExtractor={MapItemUtils.getIdFromMapItem}
      ref={(ref) => {
        this.listRef = ref;
      }}
      renderItem={({ item, index }) => this.renderListItem(item, styles.listItem, index + 1)}
      style={styles.listStyle}
      onMomentumScrollEnd={this.onListScroll}
      snapToAlignment="center"
      snapToInterval={ListItemWidth + HalfListMargin}
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
    const fullItemWidth = ListItemWidth + HalfListMargin;
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

    if (supportedNavigationModes) {
      this.setState({ selectedNavigationMode: supportedNavigationModes[index] });
    }
  };

  render() {
    const { items, supportedNavigationModes, userLocation } = this.props;
    const { selectedNavigationMode, activeMarker, shouldShowInstructions } = this.state;

    return (
      <View style={styles.container}>
        {shouldShowInstructions && <UsageModal onRequestClose={() => this.closeInstructions()} />}
        {supportedNavigationModes && supportedNavigationModes.length > 1 && (
          <SegmentControl
            style={styles.segmentControl}
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
        {selectedNavigationMode === NavigationModeUtils.NavigationModes.AR && (
          <ARView
            offScreenMarkerViewStyle={{ top: SegmentControlHeight + 10, bottom: ListHeight + ListBottomMargin + 10 }}
            items={items}
            userLocation={userLocation}
            activeMarker={activeMarker}
            onArMarkerPressed={index => this.scrollToIndex(index)}
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
