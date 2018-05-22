// @flow

import React, { Component } from "react";
import DeviceInfo from "react-native-device-info";
import DebugView from "../shared/DebugView";

type Props = {
}

class DebugScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }


  render() {
    // if (VersionNumber.appVersion)
    console.log(`1 ${DeviceInfo.getVersion()}`);
    // if (VersionNumber.buildVersion) console.log(`2 ${VersionNumber.buildVersion}`);
    // if (VersionNumber.bundleIdentifier) console.log(`3 ${VersionNumber.bundleIdentifier}`);
    return (<DebugView
      appVersion={DeviceInfo.getVersion()}
      buildVersion={DeviceInfo.getBuildNumber()}
      bundleIdentifier={DeviceInfo.getBundleId()}
    />);
  }
}

export default DebugScreen;
