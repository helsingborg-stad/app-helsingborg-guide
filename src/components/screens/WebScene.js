import React from "react";
import { WebView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ViewContainer from "../shared/view_container";
import Navbar from "../shared/navbar";

export default (props) => {
  const leftBtn = (
    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => props.navigation.goBack()}>
      <Icon name="chevron-left" size={20} color="white" />
    </TouchableOpacity>
  );

  const { params } = props.navigation.state;

  return (
    <ViewContainer>
      <Navbar title={props.text} leftButton={leftBtn} backgroundColor="#D35098" />
      <WebView source={{ uri: params.url }} />
    </ViewContainer>
  );
};
