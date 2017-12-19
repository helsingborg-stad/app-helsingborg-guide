import React, {
  Component,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
import * as _ from "lodash";
import ViewContainer from "../shared/view_container";
import ImageView from "../shared/image_view";
import ListItem from "../shared/list_item";
import LogoView from "../shared/LogoView";
import TimingService from "../../services/timingService";
import LangService from "../../services/langService";
import SlimNotificationBar from "../shared/SlimNotificationBar";
import NoInternetText from "../shared/noInternetText";
import * as internetActions from "../../actions/internetActions";
import * as subLocationActions from "../../actions/subLoactionActions";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
  AnalyticsUtils,
} from "../../utils/";
import DirectionsTouchable from "./../shared/DirectionsTouchable";

const styles = StyleSheet.create({
  scrollView: {},
  imageViewContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: Colors.white,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 23,
      fontWeight: "bold",
      textAlign: "center",
    }],
  ),
  logoContainer: {
    flex: 1,
    padding: 10,
  },
  logo: {
    marginVertical: 10,
    width: 100,
    height: 50,
  },
  articleContainer: {
    flex: 4,
    paddingHorizontal: 34,
    paddingVertical: 10,
  },
  articleDescriptionText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 14,
      lineHeight: 20,
    }],
  ),
  articleHeaderText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 19,
      lineHeight: 21,
      marginVertical: 10,
    }],
  ),
  subLocationsContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  subLocationContainer: {
    minHeight: 160,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.greyBorderColor,
  },
  openTimeContainer: {
    flex: 1,
    paddingTop: 20,
  },
  openTimeText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "300",
      lineHeight: 19,
    }],
  ),
  closeBtnContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
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
    };
  };

  static displayLogo(guideGroup) {
    const logoType = guideGroup.apperance.logotype;
    return <LogoView logoType={logoType} placeHolder={guideGroup.name} />;
  }

  // TODO extract to some service class
  static async openUrlIfValid(url) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        return Linking.openURL(url);
      }
    } catch (error) {
      console.log("An error occured", error);
    }
    return null;
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
      <View style={styles.openTimeContainer}>
        <Text style={styles.openTimeText}>{text}</Text>
      </View>
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

  componentWillReceiveProps(nextProps) {
    if (this.props.subLocations.length !== nextProps.subLocations.length) {
      this.setState({
        sublocations: nextProps.subLocations,
      });
    }

    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });
  }

  _goToSubLocationScene(subLocation) {
    const { navigate } = this.props.navigation;
    const { name } = subLocation.guidegroup[0];
    AnalyticsUtils.logEvent("view_guide", { id: subLocation.id, name: subLocation.slug });
    navigate("GuideDetailsScreen", {
      title: name,
      id: subLocation.id,
    });
  }

  displaySubLocations() {
    if (!this.state.sublocations.length) return null;
    return this.state.sublocations.map((subLocation) => {
      if (!subLocation.guide_images || !subLocation.guide_images.length) return null;
      const forKids = subLocation.guide_kids;

      return (
        <TouchableOpacity key={subLocation.id} style={styles.subLocationContainer} onPress={() => this._goToSubLocationScene(subLocation)}>
          <ListItem
            imageSource={{ uri: subLocation.guide_images[0].sizes.medium_large }}
            content={subLocation.title.plain_text}
            checked={forKids}
          />
        </TouchableOpacity>
      );
    });
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

  display() {
    if (this.state.location && Object.keys(this.state.location).length) {
      const { image } = this.state.location.apperance;
      const uri = image.sizes.medium_large;
      const width = image.sizes["medium-large-width"];
      const height = image.sizes["medium-large-height"];
      return (
        <ViewContainer>
          <SlimNotificationBar visible={!this.state.internet} style={{ top: 0 }}>
            <NoInternetText />
          </SlimNotificationBar>

          <ScrollView style={styles.scrollView}>
            <View style={styles.imageViewContainer}>
              <ImageView source={{ uri }} width={width} height={height}>
                {LocationDetailsScreen.displayComingSoon(this.state.location)}
              </ImageView>
            </View>
            <View style={styles.bodyContainer}>
              <View style={styles.titleContainer}>
                {LocationDetailsScreen.displayLogo(this.state.location)}
                {LocationDetailsScreen.displayOpeningTime(this.state.location)}
                <DirectionsTouchable onPress={() => {
                  this.openGoogleMapApp(this.state.location._embedded.location[0].latitude, this.state.location._embedded.location[0].longitude);
                }}
                />
              </View>
              {this.displayArticle()}
              <View style={styles.subLocationsContainer}>{this.displaySubLocations()}</View>
            </View>
          </ScrollView>
        </ViewContainer>
      );
    }

    return null;
  }

  openGoogleMapApp(lat, lng) {
    const daddr = `${lat},${lng}`;

    const myPosition = this.props.geolocation;
    let saddr = "";
    if (myPosition) saddr = `${myPosition.coords.latitude},${myPosition.coords.longitude}`;

    let url = `google.navigation:q=${daddr}`;
    if (Platform.OS === "ios") url = `http://maps.apple.com/?t=m&dirflg=d&daddr=${daddr}&saddr=${saddr}`;

    LocationDetailsScreen.openUrlIfValid(url);
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
