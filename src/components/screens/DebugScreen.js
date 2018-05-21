// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import DebugView from "../shared/DebugView";

type Props = {
  version: string,
}

class DebugScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }


  render() {
    const { version } = this.props;
    return (<DebugView version={version} />);
  }
}


function mapStateToProps(state: RootState) {
  const { version } = state.uiState;

  return {
    version,
  };
}

export default connect(mapStateToProps)(DebugScreen);
