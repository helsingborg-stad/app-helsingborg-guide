/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

const styles = StyleSheet.create({
  barsContainer: {
    flex: 1,
    maxWidth: 10
  },
  bar: {
    flex: 1
  }
});

type Props = {
  visible: any
};

export default class ColoredBar extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { colors: Colors.coloredBar };
  }

  displayBars() {
    if (this.props.visible) {
      return this.state.colors.map((item, index) => {
        const style = { backgroundColor: item };
        return <View key={index} style={[styles.bar, style]} />;
      });
    }
  }
  render() {
    return <View style={styles.barsContainer}>{this.displayBars()}</View>;
  }
}
