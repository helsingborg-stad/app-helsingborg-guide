/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class ErrorText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <Icon name="info" size={17} color="white" />
        </View>
        <View style={styles.bigTextContainer}>
          <Text style={styles.bigText}>{this.props.text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor:'#f9f9f9',
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
    color: "#f9f9f9",
  },
});
