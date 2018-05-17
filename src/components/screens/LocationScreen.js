// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";
import { AnalyticsUtils } from "../../utils/";
import { selectCurrentGuide } from "../../actions/uiStateActions";

type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  geolocation: GeolocationType,
  navigation: Object,
  selectCurrentGuide(guide: Guide): void
}

class LocationScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  onPressGuide = (guide: Guide) => {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
    if (guide.guideType === "trail") {
      this.props.selectCurrentGuide(guide);
      navigate("TrailScreen", { guide, title: guide.name });
    } else if (guide.guideType === "guide") {
      this.props.selectCurrentGuide(guide);
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

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentGuide: (guide: Guide) => dispatch(selectCurrentGuide(guide)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen);
