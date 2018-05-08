// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ObjectView from "../shared/ObjectView";

type Props = {
  currentContentObject: ContentObject
}

class ObjectScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  render() {
    const { currentContentObject } = this.props;
    return (<ObjectView ContentObject={currentContentObject} />);
  }
}

function mapStateToProps(state: RootState) {
  const { currentContentObject } = state.uiState;

  return {
    currentContentObject,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectScreen);
