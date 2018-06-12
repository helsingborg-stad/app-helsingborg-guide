// @flow

import React, { Component } from "react";

import { connect } from "react-redux";
import { Animated, View, Image, Dimensions, Platform } from "react-native";
import styles from "./style";
import BottomBarIcon from "../../../components/shared/BottomBarIcon";


const barBackground = require("../../../images/background-navigation.png");
const barTabLeft = require("../../../images/bottom-left.png");
const barTabCenter = require("../../../images/bottom-center.png");
const barTabRight = require("../../../images/bottom-right.png");
const barTabRightDisabled = require("../../../images/bottom-right-disabled.png");
const barTabCenterDisabled = require("../../../images/bottom-center-disabled.png");
const barTabLeftDisabled = require("../../../images/bottom-left-disabled.png");

// Sorry /Björn
const isIphoneX = () => {
  const d = Dimensions.get("window");
  const { height, width } = d;

  return (
    Platform.OS === "ios" &&
    (height === 812 || width === 812)
  );
};

const viewContainerHeight: number = isIphoneX() ? 80 : 68;
const buttonTabBottom: number = isIphoneX() ? 77 : 68;
const transitionDuration: number = 300;

type Props = {
  // currentBottomBarTab: number,
  showBottomBar: boolean,
  // selectBottomBarTab(id: number): void,
}

type State = {
  animViewContainer: Animated.Value,
  animTabBottom: Animated.Value,
  selectedTab: number,
}

class BottomBarView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animViewContainer: new Animated.Value(0),
      animTabBottom: new Animated.Value(0),
      selectedTab: 0,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.showBottomBar && !this.props.showBottomBar) {
      Animated.timing(this.state.animViewContainer, { toValue: viewContainerHeight, duration: transitionDuration }).start();
      Animated.timing(this.state.animTabBottom, { toValue: buttonTabBottom, duration: transitionDuration }).start();
    } else if (!nextProps.showBottomBar && this.props.showBottomBar) {
      this.setState({ animViewContainer: new Animated.Value(0) });
      this.setState({ animTabBottom: new Animated.Value(0) });
    }
  }

  onBottomBarTabSelected(index: number) {
    console.log("on bottom bar tab selected");
    this.setState({ selectedTab: index });
    // this.props.selectBottomBarTab(index);
  }

  displayIcons() {
    return (
      <View style={styles.iconContainer}>
        <BottomBarIcon index={0} selected={this.state.selectedTab === 0} selectBottomBarTab={index => this.onBottomBarTabSelected(index)} />
        <BottomBarIcon index={1} selected={this.state.selectedTab === 1} selectBottomBarTab={index => this.onBottomBarTabSelected(index)} />
        <BottomBarIcon index={2} selected={this.state.selectedTab === 2} selectBottomBarTab={index => this.onBottomBarTabSelected(index)} />
      </View >
    );
  }

  displayButtonTabs() {
    return (
      <Animated.View style={[styles.buttonTabContainer,
      { bottom: this.state.animTabBottom },
      ]}
      >
        <Image
          style={styles.imageTab}
          resizeMode="stretch"
          source={this.state.selectedTab === 0 ? barTabLeft : barTabLeftDisabled}
        />
        <Image
          style={styles.imageTab}
          resizeMode="stretch"
          source={this.state.selectedTab === 1 ? barTabCenter : barTabCenterDisabled}
        />
        <Image
          style={styles.imageTab}
          resizeMode="stretch"
          source={this.state.selectedTab === 2 ? barTabRight : barTabRightDisabled}
        />
      </Animated.View>
    );
  }


  render() {
    if (!this.props.showBottomBar) { return null; }

    return (
      <Animated.View style={[styles.viewContainer,
      { height: this.state.animViewContainer },
      ]}
      >
        {this.displayButtonTabs()}
        <Image
          style={styles.imageBackground}
          source={barBackground}
        />
        {this.displayIcons()}
      </Animated.View>
    );
  }
}


function mapStateToProps(state: RootState) {
  const { showBottomBar } = state.uiState;
  return {
    showBottomBar,
  };
}

export default connect(mapStateToProps)(BottomBarView);
