// @flow

import React, { Component } from "react";

import { connect } from "react-redux";
import { View, Image, SafeAreaView } from "react-native";
import styles from "./style";
import { selectCurrentBottomBarTab } from "../../../actions/uiStateActions";
import BottomBarIcon from "../../../components/shared/BottomBarIcon";


const barBackground = require("../../../images/background-navigation.png");
const barTabLeft = require("../../../images/bottom-left2.png");
const barTabCenter = require("../../../images/bottom-center2.png");
const barTabRight = require("../../../images/bottom-right2.png");

type Props = {
  currentBottomBarTab: number,
  selectBottomBarTab(id: number): void,
}

function displayButtonTabs(currentBottomBarTab: number) {
  return (
    <View style={styles.buttonTabContainer}>
      <Image style={styles.imageTab} source={currentBottomBarTab === 0 ? barTabLeft : null} />
      <Image style={styles.imageTab} source={currentBottomBarTab === 1 ? barTabCenter : null} />
      <Image style={styles.imageTab} source={currentBottomBarTab === 2 ? barTabRight : null} />
    </View>
  );
}


class BottomBarView extends Component<Props> {
  displayIcons(currentBottomBarTab: number) {
    return (
      <View style={styles.iconContainer}>
        <BottomBarIcon index={0} selected={currentBottomBarTab === 0} selectBottomBarTab={this.props.selectBottomBarTab} />
        <BottomBarIcon index={1} selected={currentBottomBarTab === 1} selectBottomBarTab={this.props.selectBottomBarTab} />
        <BottomBarIcon index={2} selected={currentBottomBarTab === 2} selectBottomBarTab={this.props.selectBottomBarTab} />
      </View >
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.viewContainer}>
        {displayButtonTabs(this.props.currentBottomBarTab)}
        <Image
          style={styles.imageBackground}
          source={barBackground}
        />
        {this.displayIcons(this.props.currentBottomBarTab)}


      </SafeAreaView>
    );
  }
}


function mapStateToProps(state: RootState) {
  const { currentBottomBarTab } = state.uiState;
  return {
    currentBottomBarTab,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectBottomBarTab: (index: number) => dispatch(selectCurrentBottomBarTab(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomBarView);
