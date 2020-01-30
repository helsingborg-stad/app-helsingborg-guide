// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StatusBar } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LocationView from "@shared-components/LocationView";
import { AnalyticsUtils } from "@utils";
import { HeaderStyles } from "@assets/styles";
import { selectCurrentGuide, showBottomBar } from "@actions/uiStateActions";

type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  geolocation: GeolocationType,
  navigation: Object,
  isFetchingGuides: boolean,
  selectCurrentGuide(guide: Guide): void,
  dispatchShowBottomBar(visible: boolean): void
};

class LocationScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: <View />,
      headerLeft: <HeaderBackButton navigation={navigation} />
    };
  };

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
      this.props.dispatchShowBottomBar(true);
    }
  }

  onPressGuide = (guide: Guide) => {
    const { navigation } = this.props;
    AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
    if (guide.guideType === "trail") {
      this.props.selectCurrentGuide(guide);
      navigation.navigate("TrailScreen", {
        guide,
        title: guide.name
      });
    } else if (guide.guideType === "guide") {
      this.props.selectCurrentGuide(guide);
      navigation.navigate("GuideDetailsScreen", { title: guide.name });
    }
  };

  render() {
    const {
      currentGuideGroup,
      currentGuides,
      geolocation,
      isFetchingGuides
    } = this.props;
    const now = new Date();
    return (
      <>
        <StatusBar barStyle="light-content" />
        <LocationView
          guideGroup={currentGuideGroup}
          guides={currentGuides}
          now={now}
          geolocation={geolocation}
          navigation={this.props.navigation}
          onPressGuide={this.onPressGuide}
          isFetchingGuides={isFetchingGuides}
        />
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { isFetching } = state.guides;
  const { currentGuideGroup } = state.uiState;
  const { geolocation } = state;

  let currentGuides = [];
  if (currentGuideGroup) {
    currentGuides = state.guides.items.filter(
      guide => guide.guideGroupId === currentGuideGroup.id
    );
  }

  return {
    currentGuideGroup,
    currentGuides,
    geolocation: geolocation?.position,
    isFetchingGuides: isFetching
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentGuide: (guide: Guide) => dispatch(selectCurrentGuide(guide)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationScreen);
