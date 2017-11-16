import React,
{
  Component,
} from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import PropTypes from "prop-types";
import {
  TabBarStyles,
} from "../../styles/";

export default class SettingsScreen extends Component {
    static propTypes = {
      navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    }

    static navigationOptions = {
      title: "Inställningar",
      ...TabBarStyles.settings,
    };

    render() {
      return (
        <View />
          
      );
    }
}
