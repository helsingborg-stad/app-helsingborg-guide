// @flow
import React from "react";
import VersionNumber from "react-native-version-number";
import DebugView from "../shared/DebugView";

const DebugScreen = () => {
  return (
    <DebugView
      appVersion={VersionNumber.appVersion}
      buildVersion={VersionNumber.buildVersion}
      bundleIdentifier={VersionNumber.bundleIdentifier}
    />
  );
};

export default DebugScreen;
