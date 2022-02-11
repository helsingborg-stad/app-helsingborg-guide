// @flow

import React, { Component } from "react";
import VersionNumber from "react-native-version-number";
import DebugView from "../shared/DebugView";

type Props = {};

class DebugScreen extends Component<Props> {
  constructor() {
    super();
  }

  render() {
    return (
      <DebugView
        appVersion={VersionNumber.appVersion}
        buildVersion={VersionNumber.buildVersion}
        bundleIdentifier={VersionNumber.bundleIdentifier}
      />
    );
  }
}

export default DebugScreen;
