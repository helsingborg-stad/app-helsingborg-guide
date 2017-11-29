import React from "react";
import { WebView, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ViewContainer from "../shared/view_container";
import {
  Colors,
} from "../../styles/";

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.lightPink,
  },
});

const WebScreen = (props) => {
  const { url } = props.navigation.state.params;

  return (
    <ViewContainer>
      <WebView source={{ uri: url }} />
    </ViewContainer>
  );
};

WebScreen.navigationOptions = {
  headerRight: null,
  headerStyle: styles.header,
};

WebScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default WebScreen;
