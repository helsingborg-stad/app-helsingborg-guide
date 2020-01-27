// @flow

import React, { Component } from "react";

import { connect } from "react-redux";
import { Animated, View, Image, Dimensions, Platform } from "react-native";
import styles from "./style";
import { selectCurrentBottomBarTab } from "@actions/uiStateActions";
import BottomBarIcon from "@shared-components/BottomBarIcon";

const barBackground = require("@assets/images/background-navigation.png");
const barTabLeft = require("@assets/images/bottom-left.png");
const barTabCenter = require("@assets/images/bottom-center.png");
const barTabRight = require("@assets/images/bottom-right.png");
const barTabRightDisabled = require("@assets/images/bottom-right-disabled.png");
const barTabCenterDisabled = require("@assets/images/bottom-center-disabled.png");
const barTabLeftDisabled = require("@assets/images/bottom-left-disabled.png");

// Sorry /Björn
const isIphoneX = () => {
  const d = Dimensions.get("window");
  const { height, width } = d;

  return Platform.OS === "ios" && (height === 812 || width === 812);
};

const viewContainerHeight: number = isIphoneX() ? 80 : 68;
const buttonTabBottom: number = isIphoneX() ? 77 : 68;
const transitionDuration: number = 300;

type Props = {
  currentBottomBarTab: number,
  showBottomBar: boolean,
  selectBottomBarTab(id: number): void
};

type State = {
  animViewContainer: Animated.Value,
  animTabBottom: Animated.Value,
  showBottomBar: boolean
};

class BottomBarView extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { showBottomBar } = nextProps;
    const {
      animViewContainer,
      animTabBottom,
      showBottomBar: previouslyShowingBottomBar
    } = prevState;

    if (showBottomBar !== previouslyShowingBottomBar) {
      if (showBottomBar) {
        Animated.timing(animViewContainer, {
          toValue: viewContainerHeight,
          duration: transitionDuration
        }).start();
        Animated.timing(animTabBottom, {
          toValue: buttonTabBottom,
          duration: transitionDuration
        }).start();
        return { showBottomBar };
      } else {
        return {
          showBottomBar,
          animViewContainer: new Animated.Value(0),
          animTabBottom: new Animated.Value(0)
        };
      }
    }

    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      animViewContainer: new Animated.Value(0),
      animTabBottom: new Animated.Value(0),
      showBottomBar: props.showBottomBar
    };
  }

  displayIcons() {
    return (
      <View style={styles.iconContainer}>
        <BottomBarIcon
          index={0}
          selected={this.props.currentBottomBarTab === 0}
          selectBottomBarTab={this.props.selectBottomBarTab}
        />
        <BottomBarIcon
          index={1}
          selected={this.props.currentBottomBarTab === 1}
          selectBottomBarTab={this.props.selectBottomBarTab}
        />
        <BottomBarIcon
          index={2}
          selected={this.props.currentBottomBarTab === 2}
          selectBottomBarTab={this.props.selectBottomBarTab}
        />
      </View>
    );
  }

  displayButtonTabs() {
    return (
      <Animated.View
        style={[
          styles.buttonTabContainer,
          { bottom: this.state.animTabBottom }
        ]}
      >
        <Image
          style={styles.imageTab}
          resizeMode="stretch"
          source={
            this.props.currentBottomBarTab === 0
              ? barTabLeft
              : barTabLeftDisabled
          }
        />
        <Image
          style={styles.imageTab}
          resizeMode="stretch"
          source={
            this.props.currentBottomBarTab === 1
              ? barTabCenter
              : barTabCenterDisabled
          }
        />
        <Image
          style={styles.imageTab}
          resizeMode="stretch"
          source={
            this.props.currentBottomBarTab === 2
              ? barTabRight
              : barTabRightDisabled
          }
        />
      </Animated.View>
    );
  }

  render() {
    if (!this.props.showBottomBar) {
      return null;
    }

    return (
      <Animated.View
        style={[styles.viewContainer, { height: this.state.animViewContainer }]}
      >
        {this.displayButtonTabs()}
        <Image style={styles.imageBackground} source={barBackground} />
        {this.displayIcons()}
      </Animated.View>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentBottomBarTab, showBottomBar } = state.uiState;
  return {
    currentBottomBarTab,
    showBottomBar
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectBottomBarTab: (index: number) =>
      dispatch(selectCurrentBottomBarTab(index))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomBarView);
