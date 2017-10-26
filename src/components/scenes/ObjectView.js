import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  Button,
  Navigator,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import ViewContainer from "../shared/view_container";
import ImageView from "../shared/image_view_content";
import ButtonsBar from "../shared/btn_bar";
import ButtonsBarItem from "../shared/btn_bar_item";
import VideoView from "./VideoView";
import Swiper from "react-native-swiper";
import WebScene from "./WebScene";
import RoundedBtn from "../shared/roundedBtn";
import { LangService } from "../../services/langService";
import MediaPlayer from "../shared/MediaPlayer";
import MediaPlayeriOS from "../shared/MediaPlayeriOS";
import Footer from "../shared/footer";
import { bindActionCreators } from "redux";
import * as audioActions from "../../actions/audioActions";
import * as metricActions from "../../actions/metricActions";
import { connect } from "react-redux";
import { MediaService } from "../../services/mediaService";
import ImageScene from "./ImageScene";
import { MediaServiceiOS } from "../../services/mediaServiceiOS";
import SlimNotificationBar from "../shared/SlimNotificationBar";
import NoInternetText from "../shared/noInternetText";
import * as internetActions from "../../actions/internetActions";
import { FetchService } from "../../services/FetchService";

const MAX_IMAGE_HEIGHT = Dimensions.get("window").height * 0.65;

class ObjectView extends Component {
  mediaService;
  fetchService;

  constructor(props) {
    super(props);

    this.state = {
      contentObject: this.props.contentObject,
      audio: this.props.audio,
      audioIsLoading: false,
      internet: this.props.internet,
      audioBtnDisabled: false,
      videoBtnDisabled: false
    };

    this.fetchService = FetchService.getInstance();
    this.mediaService = MediaService.getInstance();

    this.onAudioFilePrepared = this.onAudioFilePrepared.bind(this);
  }

  componentDidMount() {
    this.listenToAudioEvents();
    this.checkAudioVideoBtns(this.state.internet);
  }

  componentWillUnmount() {
    this.stopListenIngToAudioEvents();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.audio.hasAudio != nextProps.audio.hasAudio)
      this.setState({
        audio: nextProps.audio
      });

    if (nextProps.internet != this.state.internet) {
      this.setState({ internet: nextProps.internet });
      this.checkAudioVideoBtns(nextProps.internet);
    }
  }

  checkAudioVideoBtns(internet) {
    const audio = this.state.contentObject.audio;
    const video = this.state.contentObject.video;
    if (audio && audio.url)
      this.isUrlLocallyExist(audio.url).then(exist => {
        this.setState({ audioBtnDisabled: !(exist || internet) });
      });
    if (video && video.url)
      this.isUrlLocallyExist(video.url).then(exist => {
        this.setState({ videoBtnDisabled: !(exist || internet) });
      });
  }
  isUrlLocallyExist(url) {
    return this.fetchService.isExist(url);
  }

  updateWithObjectVisited() {
    const metric = { objectKey: this.props.objectKey, isVisited: true };
    this.props.metricActions.updateMetric(metric);
  }

  _goToVideoView(videoUrl, title) {
    //no need to release the audio just pause the sound.
    this.pauseAudioFile();
    this.props.navigator.push({
      component: VideoView,
      title: "VideoView",
      passProps: { videoUrl, title }
    });
  }

  goToImageView(image) {
    this.props.navigator.push({
      component: ImageScene,
      title: "Image",
      passProps: { image }
    });
  }

  goToLink(url) {
    this.props.navigator.push({
      component: WebScene,
      title: "WebView",
      passProps: { url }
    });
  }

  displayText() {
    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{this.state.contentObject.title}</Text>
        </View>
        <View style={styles.articleContainer}>
          <Text style={styles.article}>
            {this.state.contentObject.description_plain}
          </Text>
        </View>
      </View>
    );
  }

  //###########################################
  //Audio
  onAudioFilePrepared() {
    this.updateWithObjectVisited();
  }

  listenToAudioEvents() {
    this.mediaService.onPrepared(this.onAudioFilePrepared);
  }
  stopListenIngToAudioEvents() {
    this.mediaService.unSubscribeOnPrepared(this.onAudioFilePrepared);
  }

  loadAudioFile() {
    if (!this.state.contentObject.audio || !this.state.contentObject.audio.url)
      return;
    if (this.state.audio.hasAudio) this.mediaService.release();

    let contentObject = this.state.contentObject;
    let audio = {
      url: contentObject.audio.url,
      title: contentObject.title || LangService.strings.UNKNOWN_TITLE,
      avatar_url: contentObject.image[0].sizes.thumbnail || "",
      hasAudio: true,
      isPlaying: true,
      description_plain: contentObject.description_plain
    };
    this.mediaService.init(audio);
  }
  displayAudioPlayer() {
    return <MediaPlayer />;
  }
  pauseAudioFile() {
    this.mediaService.pause();
  }

  //###############################################

  displayButtonsBar() {
    const audio = this.state.contentObject.audio;
    const video = this.state.contentObject.video;
    const audioBtnVisible = !audio || !audio.url;
    const videoBtnVisible = !video || !video.url;
    const audioBarItem = audioBtnVisible ? null : (
      <ButtonsBarItem
        disabled={this.state.audioIsLoading || this.state.audioBtnDisabled}
        onPress={() => {
          this.loadAudioFile();
        }}
        name="headphones"
        color="#7B075E"
        size={25}
        text={LangService.strings.LISTEN}
        view="row"
      />
    );
    const videoBarItem = videoBtnVisible ? null : (
      <ButtonsBarItem
        disabled={this.state.videoBtnDisabled}
        onPress={() => {
          this._goToVideoView(video.url, video.title);
        }}
        name="play-box-outline"
        color="#7B075E"
        size={25}
        text={LangService.strings.VIDEO}
        view="row"
      />
    );

    // if(!this.state.internet)
    //     return (
    //         <ButtonsBar>
    //             <NoInternetText/>
    //         </ButtonsBar>
    //     );

    return (
      <ButtonsBar>
        {audioBarItem}
        {videoBarItem}
      </ButtonsBar>
    );
  }
  displayImagesSlider() {
    if (
      !this.state.contentObject ||
      !this.state.contentObject.image ||
      !this.state.contentObject.image.length
    )
      return (
        <View style={styles.imageViewContainer}>
          <ImageView source={{ uri: null }} width="600" height="400" />
        </View>
      );

    let slides = this.state.contentObject.image.map((image, index) => {
      return (
        <View style={styles.imageViewContainer} key={index}>
          <TouchableWithoutFeedback onPress={() => this.goToImageView(image)}>
            <View>
              <ImageView
                source={{ uri: image.sizes.large }}
                width={image.sizes["large-width"]}
                height={image.sizes["large-height"]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });

    return (
      <Swiper
        style={styles.imagesSlider}
        height={MAX_IMAGE_HEIGHT}
        dotColor="white"
        activeDotColor="#D35098"
        showsButtons={false}
      >
        {slides}
      </Swiper>
    );
  }
  displayLinks() {
    if (!this.state.contentObject.links) return null;
    return this.state.contentObject.links.map((item, index) => {
      return (
        <TouchableOpacity
          style={styles.linkContainer}
          key={index}
          onPress={() => this.goToLink(item.link)}
        >
          <Text style={styles.linkText}>{item.title}</Text>
        </TouchableOpacity>
      );
    });
  }

  display() {
    if (
      this.state.contentObject &&
      Object.keys(this.state.contentObject).length
    ) {
      return (
        <ViewContainer>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <RoundedBtn
              style={styles.closeBtn}
              isActive={this.state.viewArticle}
              active={<Icon2 name="close" size={20} color="white" />}
              idle={<Icon2 name="close" size={20} color="white" />}
              onPress={() => this.props.navigator.pop()}
            />
            {this.displayImagesSlider()}
            <View style={styles.bodyContainer}>
              {this.displayButtonsBar()}
              {this.displayText()}
              <View style={styles.articleContainer}>{this.displayLinks()}</View>
            </View>
          </ScrollView>
          <Footer>{this.displayAudioPlayer()}</Footer>
        </ViewContainer>
      );
    }

    return null;
  }

  render() {
    return this.display();
  }
}

const styles = StyleSheet.create({
  imageViewContainer: { maxHeight: MAX_IMAGE_HEIGHT, flex: 1 },
  scrollView: { paddingBottom: 70 },

  bodyContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "white"
  },
  titleContainer: { flex: 1, paddingHorizontal: 34, paddingVertical: 28 },
  title: { fontSize: 22, fontWeight: "300", lineHeight: 26 },
  articleContainer: { flex: 4, paddingHorizontal: 34, paddingVertical: 10 },
  article: { fontSize: 14, lineHeight: 20 },
  subLocationsContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  imagesSlider: { maxHeight: MAX_IMAGE_HEIGHT, flex: 1 },
  linkContainer: { paddingVertical: 6 },
  linkText: { fontSize: 14, lineHeight: 20, fontWeight: "bold" },
  closeBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 100,
    width: 40,
    height: 40,
    backgroundColor: "#D35098"
  }
});

//store config

function mapStateToProps(state, ownProps) {
  //console.log('Audio state', state.audio);
  return {
    audio: state.audio,
    internet: state.internet.connected
  };
}
function mapDispatchToProps(dispatch) {
  return {
    audioActions: bindActionCreators(audioActions, dispatch),
    metricActions: bindActionCreators(metricActions, dispatch),
    internetActions: bindActionCreators(internetActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ObjectView);
