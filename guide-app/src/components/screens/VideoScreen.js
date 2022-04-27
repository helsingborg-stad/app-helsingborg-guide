import React, { PureComponent } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import PropTypes from "prop-types";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import ViewContainer from "@shared-components/view_container";
import VideoPlayer from "@shared-components/VideoPlayer";
import Colors from "@assets/styles/Colors";

import { isFileInCache, getFilePathInCache } from "@utils/DownloadMediaUtils";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.black },
  mainContainer: { backgroundColor: "black" }
});

export default class VideoScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
      headerLeft: () => <HeaderBackButton navigation={navigation} />,
      headerRight: () => <View style={{ width: 36 }} />,
      headerStyle: styles.mainContainer,
      tabBarVisible: false
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { url: null };
  }

  async componentDidMount() {
    const { videoUrl, guideID } = this.props.navigation.state.params;
    const uri = await this.tryLoadFromCache(guideID, videoUrl);

    console.log(`video URL: ${uri}`);

    this.setState({ url: uri }); //eslint-disable-line react/no-did-mount-set-state
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  tryLoadFromCache = async (guideId, uri) => {
    if (!guideId || !uri) {
      throw new Error("Null params passed");
    }

    try {
      const isInCache = await isFileInCache(`${guideId}`, uri);
      if (isInCache) {
        return `file://${getFilePathInCache(`${guideId}`, uri)}`;
      }
      return uri;
    } catch (err) {
      // do not care
      return uri;
    }
  };

  displayVideoPlayer() {
    if (this.state.url) {
      return <VideoPlayer filePath={this.state.url} />;
    }
    return null;
  }

  displayVideo() {
    return (
      <SafeAreaView style={styles.safeArea}>
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
