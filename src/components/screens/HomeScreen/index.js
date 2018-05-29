// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import LangService from "../../../services/langService";
import { HeaderStyles } from "../../../styles";
import styles from "./styles";

const settingsIcon = require("../../../images/settings.png");

type Props = {
  showLoadingSpinner: boolean
}

class HomeScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    return Object.assign(HeaderStyles.noElevation, {
      title,
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          style={styles.barButtonItem}
        >
          <Image style={styles.barButtonImage} source={settingsIcon} />
        </TouchableOpacity>
      ),
    });
  }


  render() {
    if (this.props.showLoadingSpinner) {
      return (<ActivityIndicator style={styles.loadingSpinner} />);
    }

    return (<View />);
  }
}

function mapStateToProps(state: RootState) {
  const { navigation } = state;
  const { isFetching, categories } = navigation;

  return {
    showLoadingSpinner: isFetching,
    categories,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
