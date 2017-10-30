/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component, Children } from "react";
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity, LayoutAnimation } from "react-native";
import ViewContainer from "../shared/view_container";
import Icon from "react-native-vector-icons/FontAwesome";
import RoundedBtn from "../shared/roundedBtn";

const FULL_HEIGHT = Dimensions.get("window").height;
const FULL_WIDTH = Dimensions.get("window").width;
const BOX_HEIGHT = Dimensions.get("window").height * 0.36;
const BOX_WIDTH = Dimensions.get("window").width * 0.36;
const PARENT_FAB_WIDTH = 35;
const PARENT_FAB_HEIGHT = 70;
const CHILD_FAB_WIDTH = 32;
const PARENT_FAB_BTN_DIM = 20;

const CENTER_HEIGHT = (BOX_HEIGHT - PARENT_FAB_HEIGHT) / 2;
const xZERO = CENTER_HEIGHT + CHILD_FAB_WIDTH / 2;
const RADIUS = BOX_WIDTH - CHILD_FAB_WIDTH - 20;
const TOTAL_CHILD = 3;

export default class Fab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {}

  createPosition(index, count) {
    let top,
      right;
    const angle = Math.PI / count / 2 + Math.PI / count * index;

    right = RADIUS * Math.sin(angle);
    top = xZERO + RADIUS * Math.cos(angle);

    return { top, right };
  }

  displayFabChildrenBox() {
    if (!this.state.open) return <View style={styles.childrenContainerClosed} />;

    const childrenCount = Children.count(this.props.children);

    const children = Children.map(this.props.children, (child, index) => {
      const childPositionStyle = this.createPosition(index, childrenCount);
      return <View style={[styles.child, childPositionStyle]}>{child}</View>;
    });

    return <View style={styles.fabChildrenContainer}>{children}</View>;
  }

  toggleOpen() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ open: !this.state.open });
  }

  render() {
    const fabBoxStyle = this.state.open ? { width: FULL_WIDTH, height: FULL_HEIGHT } : { backgroundColor: "rgba(0,0,0,0)" };
    return (
      <View style={[styles.fabBoxContainer, fabBoxStyle]}>
        <View style={{ flex: 1, position: "absolute", top: CENTER_HEIGHT + 50, right: 0 }}>
          <TouchableOpacity activeOpacity={0.88} onPress={this.toggleOpen.bind(this)} style={styles.parentFabContainer}>
            <View style={styles.ParentFabBtnContainer}>
              <Icon style={styles.parentIcon} name="bars" size={PARENT_FAB_BTN_DIM} color="white" />
            </View>
          </TouchableOpacity>
          {this.displayFabChildrenBox()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#cecece" },
  fabBoxContainer: {
    height: BOX_HEIGHT + 53,
    width: PARENT_FAB_WIDTH,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(255,255,255,0.94)",
    zIndex: 5000,
  },
  parentFabContainer: {
    height: PARENT_FAB_HEIGHT,
    width: PARENT_FAB_WIDTH,
    position: "absolute",
    right: 0,
    top: CENTER_HEIGHT,
    backgroundColor: "#D35098",
    borderTopLeftRadius: PARENT_FAB_WIDTH,
    borderBottomLeftRadius: PARENT_FAB_WIDTH,
    zIndex: 10000,
  },
  ParentFabBtnContainer: {
    position: "absolute",
    top: (PARENT_FAB_HEIGHT - PARENT_FAB_BTN_DIM) / 2,
    right: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D35098",
    zIndex: 10000,
  },
  parentIcon: {},

  childrenContainerClosed: {
    height: BOX_HEIGHT,
    width: 0,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(255,255,255,0)",
    borderTopLeftRadius: BOX_WIDTH,
    borderBottomLeftRadius: BOX_WIDTH,
  },
  fabChildrenContainer: {
    height: FULL_HEIGHT,
    width: FULL_WIDTH,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(255,255,255,0)",
    borderTopLeftRadius: BOX_WIDTH,
    borderBottomLeftRadius: BOX_WIDTH,
  },
  child: {
    position: "absolute",
  },
});
