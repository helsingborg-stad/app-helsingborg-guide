import React, { Component } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import VideoPlayer from "../shared/VideoPlayer";
import FetchService from "../../services/FetchService";

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: "black" },
});

export default class VideoView extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
      headerRight: null,
      headerStyle: styles.mainContainer,
    };
  }

  constructor(props) {
    super(props);
    this.state = { url: null };
    this.fetchService = FetchService.getInstance();
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      const { videoUrl } = this.props.navigation.state.params;
      this.fetchService.isExist(videoUrl).then((exist) => {
        let url = videoUrl;

        if (exist) {
          url = this.fetchService.getFullPath(url);
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
