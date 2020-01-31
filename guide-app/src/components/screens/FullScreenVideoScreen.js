import React, { Component } from "react";
import { NativeModules } from "react-native";
import VideoPlayer from "@shared-components/VideoPlayer";
import HeaderBackButton from "@shared-components/HeaderBackButton";

const { FullScreenVideoModule } = NativeModules;

const flexStyle = { flex: 1 };

export default class FullScreenVideoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton navigation={navigation} />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      url: null,
      paused: null,
      currentTime: null
    };
  }

  componentDidMount() {
    this.getParameters();
  }

  async getParameters() {
    const parameters = await FullScreenVideoModule.getVideoParameters();
    this.setState({
      url: parameters.url,
      paused: parameters.paused,
      currentTime: parameters.currentTime
    });
  }

  render() {
    const { url, paused, currentTime } = this.state;
    return (
      url && (
        <VideoPlayer
          containerStyle={flexStyle}
          style={flexStyle}
          isAndroidFullscreen
          playOnLoad={!paused}
          initialCurrentTime={currentTime}
          filePath={url}
        />
      )
    );
  }
}
