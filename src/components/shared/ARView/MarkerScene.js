import React, { Component } from "react";

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroNode,
  ViroImage
} from "react-viro";


export default class MarkerScene extends Component {
  state = {
    isInitialized: false,
  };

  _onInitialized = (tracking) => {
    switch (tracking) {
      case ViroConstants.TRACKING_NORMAL:
        console.log("Tracking initialised");
        this.setState({ isInitialized: true });
        break;
      case ViroConstants.TRACKING_LIMITED:
        console.log("Tracking Limited");
        this.setState({ isInitialized: true });
      case ViroConstants.TRACKING_NONE:
      default:
        console.log("Tracking uninitialised");
        this.setState({ isInitialized: false });
        break;
    }
  }

  render() {
    const {
      state: {
        isInitialized,
      },
      _onInitialized,
    } = this;

    return (
      <ViroARScene onInitialized={_onInitialized}>
        { !isInitialized && (<ViroText text="Starting AR" />) }
      </ViroARScene>
    );
  }
}
