/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { LangService } from "../../services/langService";
import BackgroundImage from "./BackgroundImage";

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#7B075E",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  contentContainer: {
    flex: 3,
    width: Dimensions.get("window").width * 0.75,
    // backgroundColor:'red',
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
    // flex:2,
    minHeight: Dimensions.get("window").height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
});

export default class NormalInstructionSlide extends Component {
  render() {
    return (
      <View style={[styles.slide]}>
        <View style={[styles.mainContainer, this.props.style]}>
          <View style={styles.logoContainer}>
            <Image resizeMethod="scale" resizeMode="center" source={this.props.thumbnailSource} />
          </View>
          <View style={styles.contentContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.contentText}>{this.props.content}</Text>
            </ScrollView>
          </View>
        </View>
        <BackgroundImage source={this.props.backgroundImageSource} />
      </View>
    );
  }
}
