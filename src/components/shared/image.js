import React, { Component } from "react";
import { ImageBackground, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FetchService from "../../services/FetchService";
import * as internetActions from "../../actions/internetActions";

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

    this.fetchService = FetchService.getInstance();
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

  displaySpinner() {
    let hasSpinner = true;
    if (typeof this.props.spinner === "boolean") hasSpinner = this.props.spinner;
    if (this.state.loading && hasSpinner) return <ActivityIndicator style={[styles.spinner]} />;
  }

  loadFile(fullPath) {
    if (Platform.OS === "ios") {
      this.fetchService.readFile(fullPath).then((data) => {
        this.setState({ source: { uri: `data:image/png;base64,${data}` } });
      });
    } else if (Platform.OS === "ios") {
      this.setState({ source: { uri: `file://${fullPath}` } });
    }
  }

  // not used
  setSource() {
    const source = this.props.source;
    if (this.state.internet.connected) {
      this.setState({ source });
      return;
    }
    // Only load the offline image if no internet.
    if (source && source.uri && typeof source.uri === "string") {
      const path = source.uri;
      const fullPath = this.fetchService.getFullPath(path);

      this.fetchService
        .isExist(path)
        .then((exist) => {
          if (exist) {
            this.setState({ source: { uri: `file://${fullPath}` } });
          } else {
            this.setState({ source: { uri: path } });
          }
        })
        .catch(error => console.log("error in OImage:isExist"));
    } else this.setState({ source: require("../../images/no-image-featured-image.png") });
  }

  displayImage() {
    return (
      <ImageBackground
        style={this.props.style}
        source={this.state.source}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
        resizeMethod={this.props.resizeMethod}
        resizeMode={this.props.resizeMode}
      >
        {this.displaySpinner()}
        {this.props.children}
      </ImageBackground>
    );
  }

  render() {
    return this.displayImage();
  }
}

const styles = StyleSheet.create({
  spinner: { flex: 1, width: 100, height: 100 },
});

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
