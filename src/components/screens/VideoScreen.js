import React, { Component } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import VideoPlayer from "../shared/VideoPlayer";
import fetchService from "../../services/FetchService";

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

  componentDidMount() {
    this.timer = setTimeout(() => {
      const { videoUrl, guideID } = this.props.navigation.state.params;
      fetchService.isExist(videoUrl, guideID).then((exist) => {
        let url = videoUrl;

        if (exist) {
          url = fetchService.getFullPath(url, guideID);
        }

        this.setState({ url });
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  displayVideoPlayer() {
    if (this.state.url) return <VideoPlayer filePath={this.state.url} />;
    return null;
  }

  displayVideo() {
    return (
      <ViewContainer style={styles.mainContainer}>
        {this.displayVideoPlayer()}
      </ViewContainer>
    );
  }

  render() {
    return this.displayVideo();
  }
}
