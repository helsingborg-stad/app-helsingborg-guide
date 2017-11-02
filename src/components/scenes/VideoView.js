import React, { Component } from "react";
import { View, Text, Button, Navigator, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ViewContainer from "../shared/view_container";
import VideoPlayer from "../shared/VideoPlayer";
import Navbar from "../shared/navbar";
import { FetchService } from "../../services/FetchService";

export default class VideoView extends Component {
  timer;
  fetchService;
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
  }

  displayVideo() {
    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigation.goBack()}>
        <Icon name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
    );

    return (
      <ViewContainer style={styles.mainContainer}>
        <Navbar title={this.props.title} leftButton={leftBtn} backgroundColor="black" />

        {this.displayVideoPlayer()}
      </ViewContainer>
    );
  }

  render() {
    return this.displayVideo();
  }
}

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: "black" },
});
