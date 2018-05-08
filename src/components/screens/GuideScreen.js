// @flow

import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import GuideView from "../shared/GuideView";

declare type Props = { currentGuide: ?Guide, navigation: any }

class GuideScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params) {
      const { title } = params;
      if (title) {
        return { title };
      }
    }
    return {};
  };

  constructor(props: Props) {
    super(props);

    const { currentGuide } = props;
    const title = currentGuide ? currentGuide.name : null;
    props.navigation.setParams({ title });
  }

  render() {
    const { currentGuide } = this.props;
    return currentGuide ? (<GuideView guide={currentGuide} />) : <View />;
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}


function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
