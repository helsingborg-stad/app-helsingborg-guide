// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ObjectView from "../shared/ObjectView";
import { selectCurrentContentObjectImage } from "../../actions/uiStateActions";

type Props = {
  currentContentObject: ContentObject,
  currentContentObjectImageIndex: number,
  navigation: Object,
  selectCurrentContentObjectImage(newIndex: number): void,
}

class ObjectScreen extends Component<Props> {
  constructor() {
    super();
    console.log("constructor");
  }

  onSwiperIndexChanged = (newIndex: number) => {
    this.props.selectCurrentContentObjectImage(newIndex);
  };

  onGoToImage = (image: Images) => {
    const { navigate } = this.props.navigation;
    navigate("ImageScreen", { image });
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
