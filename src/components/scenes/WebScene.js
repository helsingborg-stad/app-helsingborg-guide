import React, { Component } from "react";
import { WebView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ViewContainer from "../shared/view_container";
import Navbar from "../shared/navbar";

export default class TestScene extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const leftBtn = (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => this.props.navigator.pop()}>
        <Icon name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
    );

    const { params } = this.props.navigation.state;

    return (
      <ViewContainer>
        <Navbar title={this.props.text} leftButton={leftBtn} backgroundColor="#D35098" />
        <WebView source={{ uri: params.url }} />
      </ViewContainer>
    );
  }
}
