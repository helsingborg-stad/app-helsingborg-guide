// @flow

import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import GuideView from "../shared/GuideView";
import { AnalyticsUtils } from "../../utils/";
import SearchButton from "../header/SearchButton";
import { selectCurrentContentObject, showBottomBar } from "../../actions/uiStateActions";
import { releaseAudioFile } from "../../actions/audioActions";

declare type Props = {
  currentGuide: ?Guide,
  navigation: any,
  dispatchSelectContentObject(contentObject: ContentObject): void,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void,
}

class GuideScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params) {
      const { title } = params;
      return {
        title,
        headerRight: (<SearchButton navigation={navigation} />),
      };
    }
    return {};
  };

  constructor(props: Props) {
    super(props);

    const { currentGuide } = props;
    const title = currentGuide ? currentGuide.name : null;
    props.navigation.setParams({ title });
  }

  componentWillUnmount() {
    this.props.dispatchReleaseAudio();
    // this.props.dispatchShowBottomBar(true);
    const { navigation } = this.props;
    if (navigation.state.params && navigation.state.params.bottomBarOnUnMount) {
      this.props.dispatchShowBottomBar(true);
    }
  }

  onPressContentObject = (obj: ContentObject) => {
    this.props.dispatchSelectContentObject(obj);
    AnalyticsUtils.logEvent("view_object", { name: obj.title });
    this.props.navigation.navigate("ObjectScreen", { title: obj.title, currentGuide: this.props.currentGuide });
  }

  render() {
    const { currentGuide } = this.props;
    return currentGuide ?
      (
        <GuideView
          guide={currentGuide}
          onPressContentObject={this.onPressContentObject}
        />
      ) : <View />;
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}


function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: (contentObject: ContentObject) => dispatch(selectCurrentContentObject(contentObject)),
    dispatchReleaseAudio: () => dispatch(releaseAudioFile()),
    dispatchShowBottomBar: (visible: boolean) => dispatch(showBottomBar(visible)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
