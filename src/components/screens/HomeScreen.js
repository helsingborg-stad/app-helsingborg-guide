// @flow
import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

type Props = {
}

class HomeScreen extends Component<Props> {
  render() {
    return (<View />);
  }
}

function mapStateToProps(state: RootState) {
  const { navigation } = state;
  const { isFetching, categories } = navigation;
  return {
    isFetching,
    categories,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
