import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import { LocationUtils } from "./../../utils";
import LangService from "../../services/langService";
import Colors from "../../styles/Colors";
import GuideList from "../shared/GuideList";
import MapWithListView from "../shared/MapWithListView";

const settingsIcon = require("../../images/settings.png");
const mapIcon = require("../../images/iconLocation.png");
const listIcon = require("../../images/iconList.png");

const styles = StyleSheet.create({
  barButtonItem: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
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
  tabBarLabel: {
    color: Colors.white,
  },
  tabBarIndicator: {
    backgroundColor: Colors.white,
  },
});

class GuideListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    const { params = {} } = navigation.state;
    const { toggleMap, showMap } = params;
    return {
      title,
      headerRight: (
        <TouchableOpacity
          onPress={toggleMap}
          style={styles.barButtonItem}
        >
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

  _renderHeader = props => (
    <TabBar
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      indicatorStyle={styles.tabBarIndicator}
      scrollEnabled
      {...props}
    />);

  _renderScene = ({ route }) => {
    const { showMap } = this.state;
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
