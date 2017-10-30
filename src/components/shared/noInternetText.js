/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LangService } from "../../services/langService";

export default class NoInternetText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.noInternetContainer}>
          <View style={styles.bigTextContainer}>
            <Text style={styles.bigText}>{LangService.strings.NO_INTERNET_CONNECTION}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noInternetContainer: {
    // backgroundColor:'#f9f9f9',
    flex: 1,
    // flexDirection:'row',
    // maxWidth:200
  },
  iconContainer: { flex: 1, alignItems: "center", maxWidth: 30 },
  icon: {},
  bigTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigText: {
    fontSize: 12,
    color: "white",
  },
});
