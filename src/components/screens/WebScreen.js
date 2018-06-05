import React from "react";
import { WebView, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import {
  Colors,
} from "../../styles/";
import BottomBarView from "../shared/BottomBarView";


const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.darkPurple,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

const WebScreen = (props) => {
  const { url } = props.navigation.state.params;

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <WebView source={{ uri: url }} />
      </View>
      <BottomBarView navigation={props.navigation} />
    </View >
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
