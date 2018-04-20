// @flow

import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import GuideView from "../shared/GuideView";

declare type Props = { currentGuide: ?Guide }

const GuideScreen = (props: Props) => {
  console.log("GuideScreen: ", props);
  return props.currentGuide ? (<GuideView guide={props.currentGuide} />) : <View />;
};

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}


function mapDispatchToProps(dispatch: Dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
