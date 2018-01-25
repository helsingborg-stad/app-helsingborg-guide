import React, {
  Component,
} from "react";
import {
  bindActionCreators,
} from "redux";
import {
  connect,
} from "react-redux";
import {
  View,
  Text,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as guideActions from "../../actions/guideActions";
import * as subLocationActions from "../../actions/subLoactionActions";
import * as internetActions from "../../actions/internetActions";
import ViewContainer from "../shared/view_container";
import LogoView from "../shared/LogoView";
import Thumbnail from "../shared/thumbnail";
import SlimNotificationBar from "../shared/SlimNotificationBar";
import NoInternetText from "../shared/noInternetText";
import MapThumbnailsView from "../shared/MapThumbnailsView";
import RoundedBtn from "../shared/roundedBtn";
import TimingService from "../../services/timingService";
import LangService from "../../services/langService";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  AnalyticsUtils,
  StyleSheetUtils,
} from "../../utils/";

const settingsIcon = require("../../images/settings.png");

const styles = StyleSheet.create({
  barButtonItem: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  mapViewContainer: {
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  map: {
    flex: 1,
  },
  openTimeContainer: {
    paddingVertical: 20,
  },
  openTimeText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      fontWeight: "300",
      lineHeight: 19,
    }],
  ),
  listViewContainer: {
    flex: 3,
  },
  guideScroll: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 50,
    backgroundColor: Colors.offWhite,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  title: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 23,
      fontWeight: "bold",
      textAlign: "center",
    }],
  ),
  navigateBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 100,
    width: 40,
    height: 40,
    backgroundColor: Colors.lightPink,
  },
  guideView: {
    height: 400,
    flex: 1,
    flexDirection: "column",
  },
  guideViewImage: {
    height: 350,
    resizeMode: "cover",
    overflow: "hidden",
  },
  comingSoonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 27,
  },
  comingSoonTextContainer: {
    flex: 1,
    paddingHorizontal: 7,
    justifyContent: "center",
    backgroundColor: Colors.lightPurple,
  },
  comingSoonText: StyleSheetUtils.flatten([
    TextStyles.comingSoonText, {
      color: Colors.white,
      textAlign: "center",
    }],
  ),
});

class MapScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    guides: PropTypes.array.isRequired,
    active: PropTypes.object.isRequired,
    markers: PropTypes.array.isRequired,
    internet: PropTypes.bool.isRequired,
    geolocation: PropTypes.any,
    title: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  }

  static get defaultProps() {
    return {
      title: LangService.strings.APP_NAME,
      geolocation: null,
    };
  }


  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    return {
      title,
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          style={styles.barButtonItem}
        >
          <Image source={settingsIcon} />
        </TouchableOpacity>
      ),
    };
  };

  static displayLogo(guideGroup) {
    const logoType = guideGroup.apperance.logotype;
    return <LogoView logoType={logoType} placeHolder={guideGroup.name} />;
  }

  static displayOpeningTime(guideGroup) {
    if (!guideGroup) return null;
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

  static displayComingSoon(guideGroup) {
    if (!guideGroup.settings.active) {
      return (
        <View style={styles.comingSoonContainer}>
          <View style={styles.comingSoonTextContainer}>
            <Text style={styles.comingSoonText}>{LangService.strings.COMING_SOON}</Text>
          </View>
        </View>
      );
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      guides: this.props.guides || [],
      active: this.props.active || [],
      markers: this.props.markers || {},
      langChanged: false,
      internet: this.props.internet,
    };

    this.renderRow = this.renderRow.bind(this);
    this.guidePress = this.guidePress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.guides.length !== nextProps.guides.length || this.state.langChanged) {
      this.setState({
        guides: nextProps.guides,
        active: nextProps.active,
        markers: nextProps.markers,
        langChanged: false,
      });
    }
    if (nextProps.internet !== this.state.internet) this.setState({ internet: nextProps.internet });
  }

  guidePress(guide) {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("view_location", { name: guide.slug });
    navigate("LocationDetailsScreen", { location: guide });
  }

  // ##########################################

  openGoogleMapApp(lat, lng) {
    const daddr = `${lat},${lng}`;

    const myPosition = this.props.geolocation;
    let saddr = "";
    if (myPosition) saddr = `${myPosition.coords.latitude},${myPosition.coords.longitude}`;

    let url = `google.navigation:q=${daddr}`;
    if (Platform.OS === "ios") url = `http://maps.apple.com/?t=m&dirflg=d&daddr=${daddr}&saddr=${saddr}`;

    console.log("geo url", url);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        return null;
      })
      .catch(err => console.error("An error occurred", err));
  }

  // ViewList render method.
  renderRow(rowData) {
    const location = rowData._embedded.location[0];

    const button = (
      <RoundedBtn
        style={styles.navigateBtn}
        active={<Icon name="directions" size={20} color={Colors.white} />}
        idle={<Icon name="directions" size={20} color={Colors.white} />}
        onPress={() => { this.openGoogleMapApp(location.latitude, location.longitude, location.slug); }}
      />
    );
    const label = MapScreen.displayComingSoon(rowData);

    return (
      <Thumbnail
        key={rowData.id}
        imageSource={{ uri: rowData.apperance.image.sizes.medium }}
        title={rowData.name}
        buttonOverlay={button}
        labelOverlay={label}
        onPress={() => {
          this.guidePress(rowData);
        }}
      >
        <View style={styles.titleContainer}>
          {MapScreen.displayLogo(rowData)}
          {MapScreen.displayOpeningTime(rowData)}
        </View>
      </Thumbnail>
    );
  }

  render() {
    return (
      <ViewContainer>
        <SlimNotificationBar visible={!this.state.internet && this.state.guides.length} style={{ top: 50 }}>
          <NoInternetText />
        </SlimNotificationBar>

        <MapThumbnailsView
          items={this.state.guides}
          active={this.state.active}
          markers={this.state.markers}
          connected={this.state.internet}
          renderRow={this.renderRow}
        />
      </ViewContainer>
    );
  }
}

// ##########################################
function makeMarkersFromLocations(guideGroups) {
  if (!guideGroups || !guideGroups.length) return [];
  return guideGroups.map((item) => {
    const marker = { location: { latitude: null, longitude: null }, itemId: item.id };
    if (!item._embedded || !item._embedded.location.length) return marker;
    const location = item._embedded.location[0];
    marker.location.latitude = parseFloat(location.latitude);
    marker.location.longitude = parseFloat(location.longitude);
    return marker;
  });
}

// store config

function mapStateToProps(state) {
  return {
    guides: state.guides || [],
    active: state.guides[0] || {},
    markers: makeMarkersFromLocations(state.guides || []),
    internet: state.internet.connected,
    geolocation: state.geolocation,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    guideActions: bindActionCreators(guideActions, dispatch),
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
