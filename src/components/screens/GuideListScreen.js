import React, { Component } from "react";
import {
  ActivityIndicator,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import {
  LocationUtils,
  StyleSheetUtils,
} from "./../../utils";
import downloadManager from "../../services/DownloadTasksManager";
import LangService from "../../services/langService";
import {
  Colors,
  TextStyles,
  HeaderStyles,
} from "../../styles/";
import GuideList from "../shared/GuideList";
import MapWithListView from "../shared/MapWithListView";

const screenWidth = Dimensions.get("window").width;

const ios = Platform.OS === "ios";

const settingsIcon = require("../../images/settings.png");
const mapIcon = require("../../images/iconLocation.png");
const listIcon = require("../../images/iconList.png");

const styles = StyleSheet.create({
  barButtonItem: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 14,
    opacity: 0.75,
  },
  barButtonItemText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.white,
      marginRight: 8,
    },
  ]),
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.listBackgroundColor,
  },
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  tabBar: {
    backgroundColor: Colors.purple,
    elevation: 8,
  },
  tabStyle: {
    width: screenWidth / 3,
  },
  tabBarLabel: StyleSheetUtils.flatten([
    TextStyles.tabBarLabel, {
      color: Colors.white,
      marginVertical: 7,
    },
  ]),
  tabBarIndicator: {
    backgroundColor: Colors.white,
  },
  contentMissingText: {
    fontSize: 20,
    color: Colors.warmGrey,
    textAlign: "center",
    paddingTop: 20,
  },
});

// Needed to get the correct layout on the firts page in the animated tab view
const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width,
};

// The lists seem to be generated 2-4 times every time component is mounted. Keeping them around should reduce load times.
const availableLists = [];

class GuideListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    const { params = {} } = navigation.state;
    const { toggleMap, showMap } = params;
    const itemText = showMap ? LangService.strings.LIST : LangService.strings.MAP;

    return Object.assign(HeaderStyles.noElevation, {
      title,
      headerRight: (
        <TouchableOpacity
          onPress={toggleMap}
          style={styles.barButtonItem}
        >
          <Text style={styles.barButtonItemText}>{itemText}</Text>
          <Image source={showMap ? listIcon : mapIcon} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          style={styles.barButtonItem}
        >
          <Image source={settingsIcon} />
        </TouchableOpacity>
      ),
    });
  }

  static getEmbeddedLocationsFromLocation(locationItem) {
    return locationItem._embedded.location;
  }

  static numberOfGuidesForItem(item, subLocations) {
    const { contentType, id } = item;
    let numberOfGuides = 0;

    if (contentType === "location") {
      for (let i = 0; i < subLocations.length; i += 1) {
        if (subLocations[i].guidegroup === null) { console.log(`Guidegroup is undefined in ${subLocations[i].title.plain_text}`); } else if (subLocations[i].guidegroup[0] !== null && subLocations[i].guidegroup[0].id === id) { numberOfGuides += 1; }
      }
    } else {
      numberOfGuides = Object.keys(item.contentObjects).length;
    }
    return numberOfGuides;
  }

  static descriptionForItem(item, locations) {
    const { description, contentType } = item;
    if (contentType === "trail") {
      const guidegroup = locations.find(location => location.id === item.guidegroup[0].id);
      return guidegroup ? guidegroup.description : null;
    } else if (contentType === "guide") {
      return item.content.plain_text;
    }
    return description;
  }

  constructor(props) {
    super(props);

    const { categoryTypes } = this.props;
    const routes = [];

    categoryTypes.forEach((element) => {
      routes.push({ key: `${element.id}`, title: element.name, categoryType: element });
    });

    this.state = {
      showMap: false,
      index: 0,
      routes,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleMap: this.toggleMap, showMap: this.state.showMap });
    downloadManager.checkForInvalidData(this.props.downloads, this.props.downloadDataVersion);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categoryTypes !== nextProps.categoryTypes) {
      const { categoryTypes } = nextProps;
      const routes = [];
      let { index } = this.state;

      this.availableLists = [];

      categoryTypes.forEach((element) => {
        routes.push({ key: `${element.id}`, title: element.name, categoryType: element });
      });

      if (index >= routes.length) { index = 0; }
      this.setState({ routes, index });
    }

    if (LangService.forceNavigationUpdate) {
      this.availableLists = [];
      this.props.navigation.setParams({ toggleMap: this.toggleMap, showMap: this.state.showMap });
      LangService.forceNavigationUpdate = false;
    }

    return null;
  }

  componentWillUnmount() {
    const index = 0;
    const routes = [];
    this.setState({ index, routes });
  }

  toggleMap = () => {
    const showMap = !this.state.showMap;
    this.props.navigation.setParams({ showMap });
    this.setState({ showMap });
  }

  _handleIndexChange = index => this.setState({ index });

  _renderTabBarLabel = ({ route }) => (
    <Text style={styles.tabBarLabel}>{route.title}</Text>
  )

  _renderHeader = props => (
    <TabBar
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      renderLabel={this._renderTabBarLabel}
      indicatorStyle={styles.tabBarIndicator}
      tabStyle={styles.tabStyle}
      scrollEnabled
      {...props}
    />)

  _renderScene = ({ route }) => {
    // Activity indicator appears to have different behavior on ios and android based on when it's rendered in relation to TabViewAnimated. Android version in render()
    if (ios) {
      const { isFetching } = this.props;
      if (isFetching) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        );
      }
    }

    const { index, routes } = this.state;
    const { guides, locations, currentLocation, subLocations } = this.props;
    const { categoryType } = route;
    const items = [];

    // Do not render pages that are to far away from the current page
    if (Math.abs(index - routes.indexOf(route)) > 2) {
      return null;
    }

    // Check if we've already created the list, and return it if we have.
    for (let i = 0; i < availableLists.length; i += 1) {
      if (availableLists[i].title === route.title) {
        return this._getList(availableLists[i]);
      }
    }

    // Filter guides and locations
    categoryType.items.forEach((element) => {
      if (element != null) {
        if (element.type === "guide") {
          const result = guides.find(guide => guide.id === element.id);
          if (result) items.push(result);
        } else if (element.type === "guidegroup") {
          const loc = locations.find(l => l.id === element.id);
          if (loc) items.push(loc);
        }
      }
    });

    // If there aren't any items in the array, then that means that there isn't any available object of the selected type in the selected language.
    if (items.length === 0) {
      return (
        <Text style={styles.contentMissingText}>
          {LangService.strings.CONTENT_MISSING}
        </Text>
      );
    }

    // If, and only if, we know the location of the user, sort the list of items based on distance from the user. TODO: Allow re-sorting the list if user position changes.
    if (currentLocation) {
      const { coords } = currentLocation;
      items.forEach((element) => {
        const embeddedLocations = GuideListScreen.getEmbeddedLocationsFromLocation(element);
        element.distance = LocationUtils.getShortestDistance(coords, embeddedLocations);
      });
      items.sort((a, b) => a.distance - b.distance);
    }

    // Set the description and information about sub-guides for each object.
    items.forEach((item) => {
      item.description = GuideListScreen.descriptionForItem(item, locations);
      item.numberOfGuides = GuideListScreen.numberOfGuidesForItem(item, subLocations);
    });

    // Combine all the information into a new object, and save it for next time this screen is rendered.
    const newList = {
      title: route.title,
      items,
      mapItems: MapWithListView.createMapItemsFromNavItems(items),
    };
    availableLists.push(newList);
    return this._getList(newList);
  }

  _getList(listItem) {
    const { showMap } = this.state;
    const { navigation } = this.props;
    if (showMap) { return (<MapWithListView items={listItem.mapItems} navigation={navigation} />); }
    return (<GuideList items={listItem.items} navigation={navigation} />);
  }

  render() {
    const { routes } = this.state;

    // TabViewAnimated bugs out if there's only 1 tab
    if (routes.length < 2) {
      return (
        <View>
          <Text style={styles.contentMissingText}>
            {LangService.strings.CONTENT_MISSING}
          </Text>
        </View>
      );
    }

    // Activity indicator appears to have different behavior on ios and android based on when it's rendered in relation to TabViewAnimated. Ios version in _renderScene()
    if (!ios) {
      const { isFetching } = this.props;
      if (isFetching) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        );
      }
    }

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderHeader={this._renderHeader}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, items } = state.navigation;
  const { subLocations } = state;

  const guides = JSON.parse(JSON.stringify(state.subLocations.slice()));
  const locations = JSON.parse(JSON.stringify(state.guides.slice()));

  return {
    isFetching,
    categoryTypes: items,
    locations,
    guides,
    subLocations,
    currentLocation: state.geolocation,
    downloads: state.downloads,
    downloadDataVersion: state.downloadDataVersion,
  };
}

export default connect(mapStateToProps)(GuideListScreen);
