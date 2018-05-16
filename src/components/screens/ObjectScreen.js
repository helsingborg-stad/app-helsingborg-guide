// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ObjectView from "../shared/ObjectView";
import { AnalyticsUtils } from "../../utils/";
import { selectCurrentContentObjectImage } from "../../actions/uiStateActions";

type Props = {
  currentContentObject: ContentObject,
  currentContentObjectImageIndex: number,
  navigation: Object,
  selectCurrentContentObjectImage(newIndex: number): void,
}

class ObjectScreen extends Component<Props> {
  onSwiperIndexChanged = (newIndex: number) => {
    this.props.selectCurrentContentObjectImage(newIndex);
  };

  onGoToImage = (image: Images) => {
    const { navigate } = this.props.navigation;
    navigate("ImageScreen", { image });
  };

  onGoToLink = (url: string, title?: string) => {
    const { navigate } = this.props.navigation;
    AnalyticsUtils.logEvent("open_url", { title });
    navigate("WebScreen", { url });
  };

  render() {
    const { currentContentObject, currentContentObjectImageIndex } = this.props;
    const { params } = this.props.navigation.state;
    const { currentGuide } = params;
    return (<ObjectView
      contentObject={currentContentObject}
      guideType={currentGuide.guideType}
      onSwiperIndexChanged={this.onSwiperIndexChanged}
      imageIndex={currentContentObjectImageIndex}
      onGoToImage={this.onGoToImage}
      onGoToLink={this.onGoToLink}
    />);
  }
}

function mapStateToProps(state: RootState) {
  const { currentContentObject, currentContentObjectImageIndex } = state.uiState;

  return {
    currentContentObject,
    currentContentObjectImageIndex,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentContentObjectImage: (newIndex: number) => dispatch(selectCurrentContentObjectImage(newIndex)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectScreen);
