import React from "react";
import { WebView, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#D35098",
  },
});

const WebScene = (props) => {
  const { url } = props.navigation.state.params;

  return (
    <ViewContainer>
      <WebView source={{ uri: url }} />
    </ViewContainer>
  );
};

WebScene.navigationOptions = {
  headerRight: null,
  headerStyle: styles.header,
};

WebScene.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WebScene;
