// @flow

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import PhotoView from "react-native-photo-view";
import { connect } from "react-redux";
import { loadFromCache } from "../../utils/DownloadMediaUtils";

const MAX_SCALE = 2.5;
const MIN_SCALE = 0.95;
const noFeaturedImage = require("../../images/no-image-featured-image.png");

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "black",
  },
  container: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
});

type Props = {
  guideId: ?number,
  url: ?string,
};

type State = {
  imageSource: any,
};

class ImageScreen extends Component<Props, State> {
  static navigationOptions = {
    headerRight: null,
    headerStyle: styles.mainContainer,
  }

  constructor(props: Props) {
    super(props);

    console.log("ImageScreen.constructor(): ", props);

    this.state = {
      imageSource: noFeaturedImage,
    };

    const { guideId, url } = props;
    this.tryLoadFromCache(guideId, url);
  }

  tryLoadFromCache = async (guideId: ?number, uri: ?string): Promise<any> => {
    console.log("tryLoadFromCache() ", guideId, uri);

    if (!guideId || !uri) throw new Error("Null params passed");

    try {
      const data = await loadFromCache(`${guideId}`, uri);
      this.setState({ imageSource: { uri: `data:image/png;base64,${data}` } });
    } catch (err) {
      // do not care
      console.log(uri);
      this.setState({ imageSource: { uri } });
    }
  }

  render() {
    const { imageSource } = this.state;
    console.log("render() imageSource: ", imageSource);

    return (
      <PhotoView
        source={imageSource}
        minimumZoomScale={MIN_SCALE}
        maximumZoomScale={MAX_SCALE}
        androidScaleType="centerInside"
        style={styles.container}

        onLoadEnd={() => console.log("onLoadEnd")}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide, currentImage } = state.uiState;
  let id = null;
  if (currentGuide) {
    ({ id } = currentGuide);
  }

  return {
    url: currentImage,
    guideId: id,
  };
}

export default connect(mapStateToProps)(ImageScreen);
