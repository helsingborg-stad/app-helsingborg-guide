/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { LangService } from "../../services/langService";
import BackgroundImage from "./BackgroundImage";

const HALS_LOGO = require("../../images/HBG.png");

export default class FirstInstructionSlide extends Component {
  render() {
    return (
      <View style={[styles.slide]}>
        <View style={[styles.mainContainer, this.props.style]}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{LangService.strings.GUIDE}</Text>
            <Text style={styles.headerText}>{LangService.strings.HELSINGBORG}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{this.props.content}</Text>
          </View>

          <View style={styles.logoContainer}>
            <Image resizeMethod="scale" resizeMode="center" source={HALS_LOGO} />
          </View>
        </View>
        <BackgroundImage source={this.props.backgroundImageSource} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    backgroundColor: "#7B075E",

    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 50,
  },
  headerContainer: {
    flex: 1,
    minHeight: Dimensions.get("window").height * 0.35,
    // backgroundColor:'red',
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 36,
    minHeight: 50,
  },
  contentContainer: {
    flex: 1,
    // paddingVertical:40,
    // minHeight:Dimensions.get('window').height*(.2),
    // maxHeight:Dimensions.get('window').height*(.3),
    width: Dimensions.get("window").width * 0.7,
    // backgroundColor:'red',
    // alignItems:'center',
    // justifyContent:'flex-start',
  },
  contentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    minHeight: 50,
    textAlign: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 22,
  },
  logo: { width: 62, height: 66 },
});
