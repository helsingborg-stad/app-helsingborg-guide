import React, { Component } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as menuActions from "../../actions/menuActions";

const MENU_WIDTH = Dimensions.get("window").width * 0.9;
const MENU_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "white",
    width: MENU_WIDTH,
    height: MENU_HEIGHT,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10000,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "red",
  },
});

class MenuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      visible: this.props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.state.visible) {
      this.setState({
        visible: nextProps.visible,
      });
      this.animate(nextProps.visible);
    }
  }

  animate(visible) {
    if (visible) Animated.spring(this.state.animValue, { toValue: 1, tension: 60, friction: 6 }).start();
    else Animated.spring(this.state.animValue, { toValue: 0, tension: 60, friction: 6 }).start();
  }

  render() {
    let animatedStyle;
    if (this.state.animValue) {
      const translateAnim = this.state.animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [MENU_WIDTH, 0],
      });

      animatedStyle = {
        transform: [{ translateX: translateAnim }],
      };
    }

    return (
      <Animated.View style={[styles.wrapper, this.props.style, animatedStyle]}>
        <View style={styles.mainContainer}>{this.props.children}</View>
      </Animated.View>
    );
  }
}

// store config
function mapStateToProps(state) {
  return {
    visible: state.menu.visible,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    menuActions: bindActionCreators(menuActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuView);
