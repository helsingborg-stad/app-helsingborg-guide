import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

const styles = StyleSheet.create({
  barsContainer: {
    flex: 1,
    maxWidth: 10,
  },
  bar: {
    flex: 1,
  },
});

type Props = {
  visible: any,
};

const ColoredBar = (props: Props) => {
  const [colors] = useState(Colors.coloredBar);

  const displayBars = () => {
    if (props.visible) {
      return colors.map((item, index) => {
        const style = { backgroundColor: item };
        return <View key={index} style={[styles.bar, style]} />;
      });
    }
  };
  return <View style={styles.barsContainer}>{displayBars()}</View>;
};

export default ColoredBar;
