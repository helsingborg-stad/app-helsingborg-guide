// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import LocationView from "../shared/LocationView";
import LangService from "../../services/langService";

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
    return <LocationView guideGroup={currentGuideGroup} comingSoonText={LangService.strings.COMING_SOON} />;
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
