import React, { Component } from "react";
import { Text, View } from "react-native";
import { ViroARSceneNavigator, ViroUtils } from "react-viro";

import MarkerScene from "./MarkerScene";

const { isARSupportedOnDevice } = ViroUtils;

export default class ARView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arSupported: true,
      reason: "",
    };

    const unsupportedCallback = reason => this.setState({ arSupported: false, reason });
    const supportedCallback = () => this.setState({ arSupported: true });

    isARSupportedOnDevice(unsupportedCallback, supportedCallback);
  }

  render() {
    const {
      state: { arSupported, reason },
    } = this;

    console.log(arSupported, reason);

    return (
      arSupported ? (
        <ViroARSceneNavigator
          initialScene={{ scene: MarkerScene }}
          viroAppProps={{ }}
          apiKey="B896B483-78EB-42A3-926B-581DD5151EE8"
          worldAlignment="GravityAndHeading"
        />
      ) : (
        <View/>
      )
    );
  }
}

