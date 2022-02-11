// @flow

import React, { Component } from "react";
import { StatusBar } from "react-native";
import { connect } from "react-redux";

import { AnalyticsUtils } from "@utils";
import InfoOverlayToggleView from "@shared-components/InfoOverlayToggleView";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import TrailView from "@shared-components/TrailView";
import { releaseAudioFile } from "@actions/audioActions";
import { showBottomBar } from "@actions/uiStateActions";
import { Colors } from "@assets/styles";

type Props = {
  currentGuide: Guide,
  navigation: Object,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void
};

type State = {
  showInfoOverlay: boolean
};

class TrailScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    let title = null;
    let toggleInfoOverlay = () => {};
    const { params = {} } = navigation.state;
    if (params) {
      ({ title } = params);
      ({ toggleInfoOverlay } = params);
    }

    return {
      title,
      headerRight: () => (
        <InfoOverlayToggleView onToggleInfoOverlay={toggleInfoOverlay} />),
      headerLeft: () => <HeaderBackButton navigation={navigation} />
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      showInfoOverlay: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      toggleInfoOverlay: this.toggleInfoOverlay
    });
  }

  componentWillUnmount() {
    this.props.dispatchReleaseAudio();
    const { navigation } = this.props;
    if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
      this.props.dispatchShowBottomBar(true);
    }
  }

  toggleInfoOverlay = () => {
    const { showInfoOverlay } = this.state;

    AnalyticsUtils.logEvent(
      showInfoOverlay ? "close_info_overlay" : "open_info_overlay",
      { name: this.props.currentGuide.slug }
    );

    this.setState({ showInfoOverlay: !showInfoOverlay });
  };

  render() {
    const { array, index } = this.props.navigation.state.params;
    if (this.props.currentGuide.contentObjects.length <= 0) {
      return null;
    }




    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <TrailView
          trail={this.props.currentGuide}
          array={array}
          index={index}
          showInfoOverlay={this.state.showInfoOverlay}
          onToggleInfoOverlay={this.toggleInfoOverlay}
          navigation={this.props.navigation}
        />
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchReleaseAudio: () => dispatch(releaseAudioFile()),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailScreen);
