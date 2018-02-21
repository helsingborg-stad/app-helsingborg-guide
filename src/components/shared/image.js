import React, { Component } from "react";
import { ImageBackground, ActivityIndicator, Platform, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import fetchService from "../../services/FetchService";
import * as internetActions from "../../actions/internetActions";
import Colors from "../../styles/Colors";

const placeholderImage = require("../../images/no-image-featured-image.png");

class OImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      source: null,
      internet: this.props.internet,
    };

    this.onLoadStart = this.onLoadStart.bind(this);
    this.onLoadEnd = this.onLoadEnd.bind(this);
  }


  componentDidMount() {
    this.mounted = true;
    this.setSource();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.internet.connected !== nextProps.internet.connected) {
      this.setState({ internet: nextProps.internet });
      if (nextProps.internet.connected) this.setSource();
    }
  }

  onLoadStart() {
    this.setState({ loading: true });
  }
  onLoadEnd() {
    this.setState({ loading: false });
  }

  displaySpinner(width, height) {
    let hasSpinner = true;
    if (typeof this.props.spinner === "boolean") hasSpinner = this.props.spinner;
    if (this.state.loading && hasSpinner) {
      return (
        <View style={{ width, height, backgroundColor: Colors.moreOffWhite }}>
          <ActivityIndicator style={{ position: "absolute", left: (width / 2) - 10, top: (height / 2) - 10 }} />
        </View >
      );
    }
    return null;
  }

  loadFile(fullPath) {
    if (Platform.OS === "ios") {
      fetchService.readFile(fullPath).then((data) => {
        this.setState({ source: { uri: `data:image/png;base64,${data}` } });
      });
    } else if (Platform.OS === "android") {
      this.setState({ source: { uri: `file://${fullPath}` } });
    }
  }

  // not used
  setSource() {
    const { source } = this.props;
    if (this.state.internet.connected) {
      this.setState({ source });
      return;
    }
    // Only load the offline image if no internet.
    if (source && source.uri && typeof source.uri === "string") {
      const { guideID } = this.props;
      const path = source.uri;
      const fullPath = fetchService.getFullPath(path, guideID);
      fetchService
        .isExist(path, guideID)
        .then((exist) => {
          if (exist) {
            this.setState({ source: { uri: `file://${fullPath}` } });
          } else {
            this.setState({ source: { uri: path } });
          }
        })
        .catch(error => console.log("error in OImage:isExist"));
    } else this.setState({ source: placeholderImage });
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
    internet: state.internet,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    internetActions: bindActionCreators(internetActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OImage);
