/**
 * Created by msaeed on 2017-02-04.
 */
import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  children: Array
};

export default class ButtonsBar extends PureComponent<Props> {
  render() {
    return <View style={styles.bar}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding:10,
  }
});
