import React, { Component } from "react";
import {
  ImageBackground,
  ActivityIndicator,
  Platform,
  View
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import fetchService from "@services/FetchService";
import * as internetActions from "@actions/internetActions";
import Colors from "@assets/styles/Colors";

const placeholderImage = require("@assets/images/no-image-featured-image.png");

type Props = {
  internet: any,
  source: any,
  guideID: any,
  spinner: any,
  style: any,
  resizeMethod: any,
  resizeMode: any,
  children: Array
};

type State = {
  internet: any
};

class OImage extends Component<Props, State> {
  static async getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { internet, source, guideID } = nextProps;
    const { internet: previousInternet } = prevState;

    if (internet.connected !== previousInternet.connected) {
      if (internet.connected) {
        return { internet, source };
      } else {
        // Only load the offline image if no internet.
        if (source && source.uri && typeof source.uri === "string") {
          const path = source.uri;
          const fullPath = fetchService.getFullPath(path, guideID);

          try {
            const exist = await fetchService.isExist(path, guideID);
            return exist
              ? { source: { uri: `file://${fullPath}` } }
              : { source: { uri: path } };
          } catch (error) {
            console.warn("error in OImage:isExist", error);
          }
        } else {
          return { source: placeholderImage };
        }
      }
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      source: null,
      internet: this.props.internet
    };

    this.onLoadStart = this.onLoadStart.bind(this);
    this.onLoadEnd = this.onLoadEnd.bind(this);
  }

  onLoadStart() {
    this.setState({ loading: true });
  }
  onLoadEnd() {
    this.setState({ loading: false });
  }

  displaySpinner(width, height) {
    let hasSpinner = true;
    if (typeof this.props.spinner === "boolean") {
      hasSpinner = this.props.spinner;
    }
    if (this.state.loading && hasSpinner) {
      const indicatorStyle = {
        position: "absolute",
        left: width / 2 - 10,
        top: height / 2 - 10
      };

      return (
        <View style={{ width, height, backgroundColor: Colors.offWhite4 }}>
          <ActivityIndicator style={indicatorStyle} />
        </View>
      );
    }
    return null;
  }

  loadFile(fullPath) {
    if (Platform.OS === "ios") {
      fetchService.readFile(fullPath).then(data => {
        this.setState({ source: { uri: `data:image/png;base64,${data}` } });
      });
    } else if (Platform.OS === "android") {
      this.setState({ source: { uri: `file://${fullPath}` } });
    }
  }

  displayImage() {
    const { source } = this.state;
    const { style } = this.props;

    let width = 0;
    let height = 0;

    // TODO: Make all the images follow the same style structure.
    // TODO: Merge this script with image_view.js.
    // TODO: Update Slynga thumbnails to be loaded through this script.

    if (style[0]) {
      height = style[0].height;
      width = style[0].width;
    } else {
      width = style.width;
      height = style.height;
    }

    return (
      <ImageBackground
        style={style}
        source={source}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
        resizeMethod={this.props.resizeMethod}
        resizeMode={this.props.resizeMode}
      >
        {this.displaySpinner(width, height)}
        {this.props.children}
      </ImageBackground>
    );
  }

  render() {
    return this.displayImage();
  }
}

function mapStateToProps(state) {
  return {
    internet: state.internet
  };
}
function mapDispatchToProps(dispatch) {
  return {
    internetActions: bindActionCreators(internetActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OImage);
