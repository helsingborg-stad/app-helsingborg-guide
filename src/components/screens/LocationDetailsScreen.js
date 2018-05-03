import React, {
  Component,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import PropTypes from "prop-types";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
import * as _ from "lodash";

import DistanceView from "../shared/DistanceView";
import ImageView from "../shared/image_view";
import LangService from "../../services/langService";
import ListItem from "../shared/list_item";
import NoInternetText from "../shared/noInternetText";
import SlimNotificationBar from "../shared/SlimNotificationBar";
import TimingService from "../../services/timingService";
import ViewContainer from "../shared/view_container";

import * as internetActions from "../../actions/internetActions";
import * as subLocationActions from "../../actions/subLoactionActions";

import {
  Colors,
  TextStyles,
} from "../../styles/";
import { UrlUtils, StyleSheetUtils, AnalyticsUtils, LocationUtils } from "../../utils/";
import IconTextTouchable from "./../shared/IconTextTouchable";
import LinkTouchable from "./../shared/LinkTouchable";

const styles = StyleSheet.create({
  scrollView: {},
  imageViewContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  barButtonItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.75,
    paddingHorizontal: 58,

  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 30,
      textAlign: "center",
      color: Colors.black,
    }],
  ),
  articleContainer: {
    flex: 4,
    paddingTop: 10,
    paddingBottom: 5,
  },
  articleDescriptionText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.warmGrey,
    }],
  ),
  articleHeaderText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 20,
      lineHeight: 21,
      paddingBottom: 10,
      color: Colors.black,
    }],
  ),
  subLocationsHeaderText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 20,
      lineHeight: 21,
      paddingVertical: 10,
      color: Colors.black,
    }],
  ),
  subLocationsContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  subLocationContainer: {
    backgroundColor: Colors.white,
    minHeight: 160,
    justifyContent: "center",
    elevation: 8,
    marginVertical: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  openTimeContainer: {
    flex: 1,
    paddingVertical: 4,
  },
  openTimeText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "normal",
      lineHeight: 19,
      color: Colors.black,
    }],
  ),
  distanceText: StyleSheetUtils.flatten([
    TextStyles.description, {
      fontWeight: "400",
      color: Colors.warmGrey,
      textAlign: "left",
    }],
  ),
  slimNotificationBar: {
    top: 0,
  },
  comingSoonView: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    zIndex: 100,
    left: 0,
    backgroundColor: Colors.lightPurple,
  },
  comingSoonText: StyleSheetUtils.flatten([
    TextStyles.comingSoonText, {
      color: Colors.white,
    }],
  ),
});

class LocationDetailsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    subLocations: PropTypes.array.isRequired,
    internet: PropTypes.bool.isRequired,
    geolocation: PropTypes.any,
  }

  static defaultProps = {
    geolocation: null,
  }

  static navigationOptions = ({ navigation }) => {
    const { location } = navigation.state.params;
    const name = location ? location.name : undefined;
    return {
      title: name,
      headerRight: (
        <View style={styles.barButtonItem} />
      ),
    };
  }
  static displayComingSoon(guideGroup) {
    if (!guideGroup.settings.active) {
      return (
        <View style={styles.comingSoonView}>
          <Text style={styles.comingSoonText}>{LangService.strings.COMING_SOON}</Text>
        </View>
      );
    }
    return null;
  }

  static displayOpeningTime(guideGroup) {
    const openingList = guideGroup._embedded.location[0].open_hours;
    const expList = guideGroup._embedded.location[0].open_hour_exceptions;
    const opening = TimingService.getOpeningHours(openingList, expList);
    const text = opening || "";
    return (
      <Text style={styles.openTimeText}>{text}</Text>
    );
  }

  static displayDistance(currentLocation, locations) {
    if (!currentLocation) return null;
    const { coords } = currentLocation;
    const distance = LocationUtils.getShortestDistance(coords, locations);
    if (!distance) return null;
    return (
      <DistanceView style={styles.distanceText} distance={distance} useFromHereText />
    );
  }

  constructor(props) {
    super(props);

    const { subLocations, internet, location } = this.props;

    this.state = {
      location,
      sublocations: subLocations,
      internet,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subLocations.length !== nextProps.subLocations.length) {
      this.setState({
        sublocations: nextProps.subLocations,
      });
    }
    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });

    let webUrl = null;
    if (this.state.location._embedded.location[0].links) {
      this.state.location._embedded.location[0].links.forEach((element) => {
        if (element.service === "webpage") {
          webUrl = element.url;
        }
      });
      this.setState({ webUrl });
    }
  }

  _goToSubLocation(subLocation) {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("view_guide", { name: subLocation.slug });
    if (subLocation.content_type === "trail") {
      navigate("TrailScreen", {
        title: subLocation.title.plain_text,
        trail: subLocation,
      });
    } else if (subLocation.content_type === "guide") {
      navigate("GuideDetailsScreen", {
        title: subLocation.title.plain_text,
        id: subLocation.id,
      });
    }
  }

  displaySubLocations() {
    if (!this.state.sublocations.length) return null;
    return (<View style={styles.subLocationsContainer}>
      <Text style={styles.subLocationsHeaderText}>
        {LangService.strings.MEDIAGUIDES}
      </Text>
      {this.state.sublocations.map((subLocation) => {
        if (!subLocation.guide_images || !subLocation.guide_images.length) return null;
        const forKids = subLocation.guide_kids;

        return (
          <TouchableOpacity
            key={subLocation.id}
            style={styles.subLocationContainer}
            onPress={() => this._goToSubLocation(subLocation)}
          >
            <ListItem
              imageSource={{ uri: subLocation.guide_images[0].sizes.medium_large }}
              title={subLocation.title.plain_text}
              description={subLocation.guide_tagline}
              startDate={subLocation.guide_date_start}
              endDate={subLocation.guide_date_end}
              forKids={forKids}
              id={subLocation.id}
            />
          </TouchableOpacity>
        );
      })}
    </View>
    );
  }

  displayArticle() {
    const article = (
      <View style={styles.articleContainer}>
        <Text style={styles.articleHeaderText}>{`${LangService.strings.ABOUT} ${this.state.location.name}`}</Text>
        <Text style={styles.articleDescriptionText}>{this.state.location.description}</Text>
      </View>
    );
    return article;
  }

  displayWebPage() {
    if (!this.state.webUrl) { return null; }

    const webLink = (<LinkTouchable
      title={this.state.webUrl.replace(/^https?:\/\//, "")}
      onPress={() => {
        this.goToLink(this.state.webUrl, this.state.webUrl);
      }}
    />);

    return webLink;
  }

  display() {
    if (this.state.location && Object.keys(this.state.location).length) {
      const { image } = this.state.location.apperance;
      const uri = image.sizes.medium_large;
      return (
        <ViewContainer>
          <SlimNotificationBar visible={!this.state.internet} style={styles.slimNotificationBar}>
            <NoInternetText />
          </SlimNotificationBar>

          <ScrollView style={styles.scrollView}>
            <View style={styles.imageViewContainer}>
              <ImageView source={{ uri }}>
                {LocationDetailsScreen.displayComingSoon(this.state.location)}
              </ImageView>
            </View>
            <View style={styles.bodyContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{this.state.location.name}</Text>
                <View style={styles.openTimeContainer}>
                  {LocationDetailsScreen.displayOpeningTime(this.state.location)}
                  {LocationDetailsScreen.displayDistance(this.props.geolocation, this.state.location._embedded.location)}
                </View>
                <IconTextTouchable
                  iconName="directions"
                  text={LangService.strings.DIRECTIONS}
                  onPress={() => {
                    this.openGoogleMapApp(this.state.location._embedded.location[0].latitude,
                      this.state.location._embedded.location[0].longitude);
                  }}
                />
              </View>
              {this.displaySubLocations()}
              {this.displayArticle()}
              {this.displayWebPage()}

            </View>
          </ScrollView>
        </ViewContainer>
      );
    }

    return null;
  }

  goToLink(url, title) {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("open_url", { title });
    navigate("WebScreen", { url });
  }

  openGoogleMapApp(lat, lng) {
    const directionsUrl = LocationUtils.directionsUrl(lat, lng, this.props.geolocation);
    console.log(directionsUrl);
    UrlUtils.openUrlIfValid(directionsUrl, LangService.strings.OPEN_IN_MAPS, "", LangService.strings.CANCEL, LangService.strings.OPEN);
  }

  render() {
    return (
      <ViewContainer>
        {this.display()}
      </ViewContainer>
    );
  }
}

// store config
function getFilteredSubLocations(list, parentId) {
  if (!list || !list.length) return [];
  const filtered = _.filter(list, item => item.guidegroup[0].id === parentId);
  return _.sortBy(filtered, item => item.title.plain_text);
}

function mapStateToProps(state, ownProps) {
  const { location } = ownProps.navigation.state.params;
  return {
    location,
    subLocations: getFilteredSubLocations(state.subLocations, location.id) || [],
    internet: state.internet.connected,
    geolocation: state.geolocation,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationDetailsScreen);
