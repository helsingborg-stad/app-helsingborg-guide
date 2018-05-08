// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";
import { AnalyticsUtils } from "../../utils/";

type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  geolocation: GeolocationType,
  navigation: Object
}

class LocationScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  onPressGuide = (guide: Guide) => {
    console.log("onPressGuide: ", guide);
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
    if (guide.guideType === "trail") {
      navigate("TrailScreen", {
        title: guide.name,
        trail: guide,
      });
    } else if (guide.guideType === "guide") {
      // TODO dispatch select_guide_action
      navigate("GuideDetailsScreen");
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

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen);
