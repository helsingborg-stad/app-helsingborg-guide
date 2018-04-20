// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";

type Props = {
  currentGuideGroup: GuideGroup,
}

class LocationScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  render() {
    const { currentGuideGroup } = this.props;
    const now = new Date();
    return <LocationView guideGroup={currentGuideGroup} now={now} />;
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuideGroup } = state.uiState;

  return {
    currentGuideGroup,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen);
