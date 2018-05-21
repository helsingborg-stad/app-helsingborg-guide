// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import DebugView from "../shared/DebugView";
// import { AnalyticsUtils } from "../../utils/";

type Props = {
  whatevs: Object,
}

class DebugScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }


  render() {
    const { whatevs } = this.props;
    return (<DebugView />);
  }
}


function mapStateToProps(state: RootState) {
  const { whatevs } = state;

  return {
    whatevs,
  };
}

export default connect(mapStateToProps)(DebugScreen);
