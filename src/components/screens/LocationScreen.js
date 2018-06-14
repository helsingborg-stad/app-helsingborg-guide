// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";
import { AnalyticsUtils } from "../../utils/";
import { selectCurrentGuide, showBottomBar } from "../../actions/uiStateActions";

type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  geolocation: GeolocationType,
  navigation: Object,
  selectCurrentGuide(guide: Guide): void,
  dispatchShowBottomBar(visible: boolean): void,
}

class LocationScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.state.params && navigation.state.params.disableBottomBarOnUnmount) { return; }
    this.props.dispatchShowBottomBar(true);
  }

  onPressGuide = (guide: Guide) => {
    const { navigation } = this.props;
    AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
    if (guide.guideType === "trail") {
      this.props.selectCurrentGuide(guide);
      navigation.navigate("TrailScreen", {
        guide,
        title: guide.name,
        disableBottomBarOnUnmount: true,
      });
    } else if (guide.guideType === "guide") {
      this.props.selectCurrentGuide(guide);
      navigation.navigate("GuideDetailsScreen", { disableBottomBarOnUnmount: true });
    }
  }

  render() {
    const { currentGuideGroup, currentGuides, geolocation } = this.props;
    const now = new Date();
    return (<LocationView
      guideGroup={currentGuideGroup}
      guides={currentGuides}
      now={now}
      geolocation={geolocation}
      navigation={this.props.navigation}
      onPressGuide={this.onPressGuide}
    />);
  }
}


function mapStateToProps(state: RootState) {
  const { currentGuideGroup } = state.uiState;
  const { currentGuides } = state.uiState;
  const { geolocation } = state;

  return {
    currentGuideGroup,
    currentGuides,
    geolocation,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentGuide: (guide: Guide) => dispatch(selectCurrentGuide(guide)),
    dispatchShowBottomBar: (visible: boolean) => dispatch(showBottomBar(visible)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen);
