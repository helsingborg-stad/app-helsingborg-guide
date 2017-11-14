import React, {
  Component,
} from "react";
import {
  NativeModules,
} from "react-native";
import VideoPlayer from "guide-hbg/src/components/shared/VideoPlayer";

const { FullScreenVideoModule } = NativeModules;

export default class FullScreenVideoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      paused: null,
      currentTime: null,
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
      currentTime: parameters.currentTime,
    });
  }

  render() {
    const { url, paused, currentTime } = this.state;
    return url && (<VideoPlayer
      containerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      isAndroidFullscreen
      playOnLoad={!paused}
      initialCurrentTime={currentTime}
      filePath={url}
    />);
  }
}
