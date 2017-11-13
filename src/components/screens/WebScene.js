import React from "react";
import { WebView, StyleSheet } from "react-native";
import ViewContainer from "../shared/view_container";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#D35098",
  },
});

const WebScene = (props) => {
  const { params } = props.navigation.state;

  return (
    <ViewContainer>
      <WebView source={{ uri: params.url }} />
    </ViewContainer>
  );
};

WebScene.navigationOptions = {
  headerRight: null,
  headerStyle: styles.header,
};

export default WebScene;
