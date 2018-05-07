// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";

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

  render() {
    const { currentGuideGroup, currentGuides, geolocation } = this.props;
    const now = new Date();
    return (<LocationView
      guideGroup={currentGuideGroup}
      guides={currentGuides}
      now={now}
      geolocation={geolocation}
      navigation={this.props.navigation}
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
