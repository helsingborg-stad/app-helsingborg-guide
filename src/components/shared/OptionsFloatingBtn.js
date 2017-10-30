/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component, Children } from "react";
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity, LayoutAnimation } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FULL_HEIGHT = Dimensions.get("window").height;
const FULL_WIDTH = Dimensions.get("window").width;
const BOX_HEIGHT = Dimensions.get("window").height * 0.5;
const BOX_WIDTH = Dimensions.get("window").width * 0.36;
const PARENT_FAB_WIDTH = 35;
const PARENT_FAB_HEIGHT = 70;
const CHILD_FAB_WIDTH = 32;
const PARENT_FAB_BTN_DIM = 20;

const CENTER_HEIGHT = (BOX_HEIGHT - PARENT_FAB_HEIGHT) / 2;
const xZERO = CENTER_HEIGHT + CHILD_FAB_WIDTH / 2;
const RADIUS = BOX_WIDTH - CHILD_FAB_WIDTH - 20;
const TOTAL_CHILD = 3;

const TOP_POSITION = 3 * PARENT_FAB_HEIGHT;

export default class OptionsFloatingBtn extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={this.props.onPress} style={styles.fabContainer}>
        <Icon style={styles.icon} name="more-vert" size={PARENT_FAB_BTN_DIM} color="white" />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#cecece" },

  fabContainer: {
    height: PARENT_FAB_HEIGHT,
    width: PARENT_FAB_WIDTH,
    position: "absolute",
    right: 0,
    top: xZERO + CENTER_HEIGHT,
    backgroundColor: "#D35098",
    borderTopLeftRadius: PARENT_FAB_WIDTH,
    borderBottomLeftRadius: PARENT_FAB_WIDTH,
    zIndex: 10010,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 2,
  },
  icon: {},
});
