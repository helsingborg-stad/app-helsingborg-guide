// @flow

import React, { Component } from "react";

import { connect } from "react-redux";
import { View, Image, SafeAreaView } from "react-native";
import styles from "./style";
import { selectCurrentBottomBarTab } from "../../../actions/uiStateActions";
import BottomBarIcon from "../../../components/shared/BottomBarIcon";
import { AnalyticsUtils } from "../../../utils/";


const barBackground = require("../../../images/background-navigation.png");
const barTabLeft = require("../../../images/bottom-left2.png");
const barTabCenter = require("../../../images/bottom-center2.png");
const barTabRight = require("../../../images/bottom-right2.png");

const eventCalendarURL = "https://kalender.helsingborg.se/event/page/2/?simpleAppView";

type Props = {
  currentBottomBarTab: number,
  selectBottomBarTab(id: number): void,
  nav: any
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
  displayIcons = (currentBottomBarTab: number) => (
    <View style={styles.iconContainer}>
      <BottomBarIcon index={0} selected={currentBottomBarTab === 0} onTouchIcon={this.onTouchIcon} />
      <BottomBarIcon index={1} selected={currentBottomBarTab === 1} onTouchIcon={this.onTouchIcon} />
      <BottomBarIcon index={2} selected={currentBottomBarTab === 2} onTouchIcon={this.onTouchIcon} />
    </View >
  )

  onTouchIcon = (index: number) => {
    switch (index) {
      case 0:
        this.props.nav.navigate("HomeScreen");
        break;
      case 1:
        this.props.nav.navigate("WebScreen", { url: eventCalendarURL });
        AnalyticsUtils.logEvent("open_url", { eventCalendarURL });
        break;
      case 2:
        this.props.nav.navigate("SettingsScreen");
        break;
      default: break;
    }
    this.props.selectBottomBarTab(index);
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
