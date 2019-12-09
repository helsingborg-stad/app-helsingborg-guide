/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "@assets/styles"

// const FULL_HEIGHT = Dimensions.get("window").height;
// const FULL_WIDTH = Dimensions.get("window").width;
const BOX_HEIGHT = Dimensions.get("window").height * 0.5;
// const BOX_WIDTH = Dimensions.get("window").width * 0.36;
const PARENT_FAB_WIDTH = 35;
const PARENT_FAB_HEIGHT = 70;
const CHILD_FAB_WIDTH = 32;
const PARENT_FAB_BTN_DIM = 20;

const CENTER_HEIGHT = (BOX_HEIGHT - PARENT_FAB_HEIGHT) / 2;
const xZERO = CENTER_HEIGHT + CHILD_FAB_WIDTH / 2;
// const RADIUS = BOX_WIDTH - CHILD_FAB_WIDTH - 20;
// const TOTAL_CHILD = 3;

// const TOP_POSITION = 3 * PARENT_FAB_HEIGHT;

type Props = {
  onPress: any
};

export default class OptionsFloatingBtn extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={this.props.onPress}
        style={styles.fabContainer}
      >
        <Icon
          style={styles.icon}
          name="more-vert"
          size={PARENT_FAB_BTN_DIM}
          color="white"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.gray8 },

  fabContainer: {
    height: PARENT_FAB_HEIGHT,
    width: PARENT_FAB_WIDTH,
    position: "absolute",
    right: 0,
    top: xZERO + CENTER_HEIGHT,
    backgroundColor: Colors.themeControl,
    borderTopLeftRadius: PARENT_FAB_WIDTH,
    borderBottomLeftRadius: PARENT_FAB_WIDTH,
    zIndex: 10010,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 2
  },
  icon: {}
});
