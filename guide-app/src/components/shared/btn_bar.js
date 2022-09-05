import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  children: Array,
};

const ButtonsBar = (props: Props) => {
  return <View style={styles.bar}>{props.children}</View>;
};

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding:10,
  },
});

export default memo(ButtonsBar);
