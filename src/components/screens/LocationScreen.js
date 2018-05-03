// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";

type Props = {
  currentGuideGroup: GuideGroup,
  geolocation: GeolocationType,
  navigation: Object
}

class LocationScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  render() {
    const { currentGuideGroup, geolocation } = this.props;
    const now = new Date();
    return (<LocationView
      guideGroup={currentGuideGroup}
      now={now}
      geolocation={geolocation}
      navigation={this.props.navigation}
    />);
  }
}


function mapStateToProps(state: RootState) {
  const { currentGuideGroup } = state.uiState;
  const { geolocation } = state;

  return {
    currentGuideGroup,
    geolocation,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen);
