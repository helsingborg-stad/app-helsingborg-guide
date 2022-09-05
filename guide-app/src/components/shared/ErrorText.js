import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "@assets/styles";

type Props = {
  text: any,
};

const ErrorText = (props: Props) => (
  <View style={styles.mainContainer}>
    <View style={styles.iconContainer}>
      <Icon name="info" size={17} color={Colors.white} />
    </View>
    <View style={styles.bigTextContainer}>
      <Text style={styles.bigText}>{props.text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  iconContainer: { flex: 1, alignItems: "flex-start" },
  icon: {},
  bigTextContainer: {
    flex: 10,
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
  bigText: {
    fontSize: 12,
    color: Colors.offWhite3,
  },
});

export default ErrorText;
