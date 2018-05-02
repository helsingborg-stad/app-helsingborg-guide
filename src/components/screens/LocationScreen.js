// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";

type Props = {
  currentGuideGroup: GuideGroup,
  currentPointProperties: Object,
  geolocation: GeolocationType,
  navigation: Object
}

class LocationScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  render() {
    const { currentGuideGroup, currentPointProperties, geolocation } = this.props;
    const now = new Date();
    return (<LocationView
      guideGroup={currentGuideGroup}
      pointProperties={currentPointProperties.items.length > 0 ? currentPointProperties.items : null}
      now={now}
      geolocation={geolocation}
      navigation={this.props.navigation}
    />);
  }
}


function mapStateToProps(state: RootState) {
  const { currentGuideGroup, currentPointProperties } = state.uiState;
  const { geolocation } = state;

  return {
    currentGuideGroup,
    currentPointProperties,
    geolocation,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen);
