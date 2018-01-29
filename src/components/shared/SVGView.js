import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import SvgUri from "react-native-svg-uri";
import {
  Colors,
} from "../../styles/";


const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.listBackgroundColor,
  },

});


export default class SVGView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  displaySVG(logoType, placeholder) {
    if (!logoType) return <Text style={styles.title}>{placeholder}</Text>;

    return (
      <View style={styles.container}>
        <SvgUri
          width="200"
          height="200"
          source={{ uri: logoType }}
        />
      </View>
    );
  }

  render() {
    return this.displaySVG(this.props.logoType, this.props.placeHolder);
  }
}
