/**
 * Created by msaeed on 2017-02-04.
 */
/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, WebView, TouchableOpacity } from "react-native";
import ViewContainer from "../shared/view_container";
import Icon from "react-native-vector-icons/FontAwesome";
import Navbar from "../shared/navbar";

export default class TestScene extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigator.pop()}>
        <Icon name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
    );

    return (
      <ViewContainer>
        <Navbar title={this.props.text} leftButton={leftBtn} backgroundColor="#D35098" />
        <WebView
          source={{ uri: this.props.url }}
          // style={{marginTop: 20}}
        />
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({});
