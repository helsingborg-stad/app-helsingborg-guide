// @flow

import React, { Component } from "react";

import { connect } from "react-redux";
import { Animated, View, Image, Dimensions, Platform } from "react-native";
import styles from "./style";
import { selectCurrentBottomBarTab } from "@actions/uiStateActions";
import { Navigation } from "@config/ui";
import { setShowFilterButton } from "@actions/uiStateActions";


const barBackground = require("@assets/images/background-navigation.png");

// Sorry /Björn
// TODO: rename to something with isIphoneXOrAbove?
const isIphoneX = () => {
  const d = Dimensions.get("window");
  const { height, width } = d;
  return Platform.OS === "ios" && (height >= 812 || width >= 812);
};

const viewContainerHeight: number = isIphoneX() ? 84 : 68;
const buttonTabBottom: number = isIphoneX() ? 84 : 68;
const transitionDuration: number = 300;

type Props = {
  currentBottomBarTab: number,
  showBottomBar: boolean,
  selectBottomBarTab(id: number): void,
  dispatchSetShowFilterButton(boolean: Boolean): void,
};

type State = {
  animViewContainer: Animated.Value,
  animTabBottom: Animated.Value,
  showBottomBar: boolean,
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
          duration: transitionDuration,
          useNativeDriver: false
        }).start();
        Animated.timing(animTabBottom, {
          toValue: buttonTabBottom,
          duration: transitionDuration,
          useNativeDriver: false
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
        {Navigation.bottomBarButtons.map(({ id, ButtonComponent }, index) => (
          <ButtonComponent
            key={id}
            selected={this.props.currentBottomBarTab === index}
            onPress={() => {
              this.props.selectBottomBarTab(index, id),
                this.props.dispatchSetShowFilterButton(id === "home");
            }}
          />
        ))}
      </View>
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
    selectBottomBarTab: (index: number, id: any) => {
      dispatch(selectCurrentBottomBarTab(index));
    },
    dispatchSetShowFilterButton: (boolean) => {
      dispatch(setShowFilterButton(boolean));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomBarView);
