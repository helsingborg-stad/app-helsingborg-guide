import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PhotoView from "react-native-photo-view";
import ViewContainer from "../shared/view_container";
import Navbar from "../shared/navbar";
import { FetchService } from "../../services/FetchService";

const MAX_SCALE = 2.5;
const MIN_SCALE = 0.95;
const FULL_WIDTH = Dimensions.get("window").width;

const noFeaturedImage = require("../../images/no-image-featured-image.png");

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "black",
  },
});

export default class ImageScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: null,
    };

    this.fetchService = FetchService.getInstance();
  }

  componentDidMount() {
    this.setSource();
  }

  setSource() {
    const { image } = this.props.navigation.state.params;
    const uri = image.sizes.large;
    if (typeof uri === "string") {
      this.fetchService.isExist(uri).then((exist) => {
        const fullPath = this.fetchService.getFullPath(uri);
        if (exist) {
          this.setState({ source: { uri: `file://${fullPath}` } });
        } else {
          this.setState({ source: { uri } });
        }
      });
    } else {
      this.setState({ source: noFeaturedImage });
    }
  }

  loadFile(fullPath) {
    if (Platform.OS === "ios") {
      this.fetchService.readFile(fullPath).then((data) => {
        this.setState({ source: { uri: `data:image/png;base64,${data}` } });
      });
    } else if (Platform.OS === "android") {
      this.setState({ source: { uri: `file://${fullPath}` } });
    }
  }

  render() {
    const { image } = this.props.navigation.state.params;
    const { sizes } = image;
    const width = parseInt(sizes["large-width"]);
    const height = parseInt(sizes["large-height"]);
    const scale = width / FULL_WIDTH;

    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigation.goBack()}>
        <Icon name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
    );

    return (
      <ViewContainer style={styles.mainContainer}>
        <Navbar title={image.caption} leftButton={leftBtn} backgroundColor="rgba(0,0,0,0.4)" />
        {
          <PhotoView
            source={this.state.source}
            minimumZoomScale={MIN_SCALE}
            maximumZoomScale={MAX_SCALE}
            androidScaleType="centerInside"
            onLoad={() => {}}
            style={{ flex: 1, width: width / scale, height: height / scale }}
          />
        }
      </ViewContainer>
    );
  }
}
