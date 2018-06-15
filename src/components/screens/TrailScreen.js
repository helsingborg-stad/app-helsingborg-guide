// @flow

import React, { Component } from "react";

import { connect } from "react-redux";

import InfoOverlayToggleView from "../shared/InfoOverlayToggleView";
import TrailView from "../shared/TrailView";
import { releaseAudioFile } from "../../actions/audioActions";
import { showBottomBar } from "../../actions/uiStateActions";

type Props = {
  currentGuide: Guide,
  navigation: Object,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void,
};

type State = {
  showInfoOverlay: boolean
};

class TrailScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    let title = null;
    let toggleInfoOverlay = () => { };
    const { params = {} } = navigation.state;
    if (params) {
      ({ title } = params);
      ({ toggleInfoOverlay } = params);
    }
    return {
      title,
      headerRight: (
        <InfoOverlayToggleView onToggleInfoOverlay={toggleInfoOverlay} />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      showInfoOverlay: true,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      toggleInfoOverlay: this.toggleInfoOverlay,
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
    this.setState({ showInfoOverlay: !this.state.showInfoOverlay });
  };

  render() {
    if (this.props.currentGuide.contentObjects.length <= 0) {
      return null;
    }

    return (
      <TrailView
        trail={this.props.currentGuide}
        showInfoOverlay={this.state.showInfoOverlay}
        onToggleInfoOverlay={this.toggleInfoOverlay}
        navigation={this.props.navigation}
      />
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
    dispatchShowBottomBar: (visible: boolean) => dispatch(showBottomBar(visible)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailScreen);
