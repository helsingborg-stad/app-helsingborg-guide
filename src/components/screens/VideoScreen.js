import React, { Component } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import VideoPlayer from "../shared/VideoPlayer";
import Colors from "../../styles/Colors";

import { isFileInCache, getFilePathInCache } from "../../utils/DownloadMediaUtils";

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: "black" },
});

export default class VideoScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
      headerRight: null,
      headerStyle: styles.mainContainer,
      tabBarVisible: false,
    };
  }

  constructor(props) {
    super(props);
    this.state = { url: null };
  }

  async componentDidMount() {
    const { videoUrl, guideID } = this.props.navigation.state.params;
    const uri = await this.tryLoadFromCache(guideID, videoUrl);

    console.log(`video URL: ${uri}`);

    this.setState({ url: uri });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  tryLoadFromCache = async (guideId, uri) => {
    if (!guideId || !uri) throw new Error("Null params passed");

    try {
      const isInCache = await isFileInCache(`${guideId}`, uri);
      if (isInCache) { return `file://${getFilePathInCache(`${guideId}`, uri)}`; } return uri;
    } catch (err) {
      // do not care
      return uri;
    }
  }

  displayVideoPlayer() {
    if (this.state.url) return <VideoPlayer filePath={this.state.url} />;
    return null;
  }

  displayVideo() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black }}>
        <ViewContainer style={styles.mainContainer}>
          {this.displayVideoPlayer()}
        </ViewContainer>
      </SafeAreaView>
    );
  }

  render() {
    return this.displayVideo();
  }
}
