// @flow

import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import PhotoView from "react-native-photo-view";
import { connect } from "react-redux";
import { loadFromCache } from "../../../utils/DownloadMediaUtils";
import styles from "./styles";

const MAX_SCALE = 2.5;
const MIN_SCALE = 0.95;


type Props = {
  guideId: ?number,
  url: ?string,
};

type State = {
  imageSource?: ?any,
};

class ImageScreen extends Component<Props, State> {
  static navigationOptions = {
    headerRight: null,
    headerStyle: styles.mainContainer,
  }

  constructor(props: Props) {
    super(props);

    this.state = {};

    const { guideId, url } = props;
    this.tryLoadFromCache(guideId, url);
  }

  tryLoadFromCache = async (guideId: ?number, uri: ?string): Promise<any> => {
    if (!guideId || !uri) throw new Error("Null params passed");

    try {
      const data = await loadFromCache(`${guideId}`, uri);
      this.setState({ imageSource: { uri: `data:image/png;base64,${data}` } });
    } catch (err) {
      // do not care
      this.setState({ imageSource: { uri } });
    }
  }

  renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>)

  render() {
    const { imageSource } = this.state;
    if (!imageSource) {
      return this.renderLoadingScreen();
    }

    return (
      <PhotoView
        source={imageSource}
        minimumZoomScale={MIN_SCALE}
        maximumZoomScale={MAX_SCALE}
        androidScaleType="centerInside"
        style={styles.container}
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
