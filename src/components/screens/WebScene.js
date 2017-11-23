import React from "react";
import { WebView, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import {
  Colors,
  TabBarStyles,
} from "../../styles/";

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.lightPink,
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
  ...TabBarStyles.guide,
};

WebScene.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WebScene;
