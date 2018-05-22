// @flow


import { connect } from "react-redux";
import React, { Component } from "react";
import VersionNumber from "react-native-version-number";
import DebugView from "../shared/DebugView";
import { debugEnableDrafts } from "../../actions/uiStateActions";

type Props = {
  draftsEnabled: boolean,
  dispatchDebugEnableDrafts(enable: boolean): void
}

class DebugScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");

    this.onShowDraftsChange = this.onShowDraftsChange.bind(this);
  }

  onShowDraftsChange: Function;

  onShowDraftsChange(value: boolean) {
    this.props.dispatchDebugEnableDrafts(value);
  }


  render() {
    return (<DebugView
      appVersion={VersionNumber.appVersion}
      buildVersion={VersionNumber.buildVersion}
      bundleIdentifier={VersionNumber.bundleIdentifier}
      showDrafts={this.props.draftsEnabled}
      onShowDraftsChange={this.onShowDraftsChange}
    />);
  }
}


function mapStateToProps(state: RootState) {
  const { draftsEnabled } = state.uiState;

  return {
    draftsEnabled,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchDebugEnableDrafts: (enable: boolean) => dispatch(debugEnableDrafts(enable)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugScreen);
