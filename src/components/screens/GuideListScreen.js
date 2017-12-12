import React, { Component } from "react";
import {
  ActivityIndicator,
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
import LangService from "../../services/langService";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import GuideList from "../shared/GuideList";
import MapWithListView from "../shared/MapWithListView";

const screenWidth = Dimensions.get("window").width;

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
});

class GuideListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    const { params = {} } = navigation.state;
    const { toggleMap, showMap } = params;
    const itemText = showMap ? LangService.strings.LIST : LangService.strings.MAP;
    return {
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
    };
  }

  static getEmbeddedLocationsFromLocation(locationItem) {
    return locationItem._embedded.location;
  }

  static numberOfGuidesForItem(item, subLocations) {
    const { contentType, id } = item;
    let numberOfGuides = 0;

    if (contentType === "location") {
      numberOfGuides = subLocations.filter(subLocationItem => subLocationItem.guidegroup[0].id === id).length;
    } else {
      numberOfGuides = Object.keys(item.contentObjects).length;
    }
    return numberOfGuides;
  }

  static descriptionForItem(item, locations) {
    const { description, contentType } = item;
    if (contentType === "trail") {
      return locations.find(location => location.id === item.guidegroup[0].id).description;
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
    />);

  _renderScene = ({ route }) => {
    const { showMap, index, routes } = this.state;
    if (Math.abs(index - routes.indexOf(route)) > 2) {
      // Do not render pages that are to far away from the current page
      return null;
    }

    const { guides, locations, navigation, currentLocation, subLocations } = this.props;
    const { categoryType } = route;

    const items = [];
    // filter guides and locations
    categoryType.items.forEach((element) => {
      switch (element.type) {
        case "guide":
        {
          const result = guides.find(guide => guide.id === element.id);
          items.push(result);
          break;
        }
        case "guidegroup":
        {
          const loc = locations.find(l => l.id === element.id);
          items.push(loc);
          break;
        }
        default:
      }
    });

    if (showMap) {
      const mapItems = MapWithListView.createMapItemsFromNavItems(items);
      return (<MapWithListView items={mapItems} navigation={navigation} />);
    }

    // number of guides and descriptions
    items.forEach((item) => {
      item.description = GuideListScreen.descriptionForItem(item, locations);
      item.numberOfGuides = GuideListScreen.numberOfGuidesForItem(item, subLocations);
    });

    if (currentLocation) {
      // calculate distances from current location
      const { coords } = currentLocation;
      items.forEach((element) => {
        const embeddedLocations = GuideListScreen.getEmbeddedLocationsFromLocation(element);
        element.distance = LocationUtils.getShortestDistance(coords, embeddedLocations);
      });
      items.sort((a, b) => a.distance > b.distance);
    }
    return (<GuideList items={items} navigation={navigation} />);
  }


  render() {
    const { isFetching } = this.props;

    if (isFetching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
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
  };
}

export default connect(mapStateToProps)(GuideListScreen);
