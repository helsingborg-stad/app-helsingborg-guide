import React, { Component } from "react";
import { View } from "react-native";
import LangService from "../../services/langService";
import TabBarStyles from "../../styles/TabBarStyles";

export default class GuideListScreen extends Component {
    static navigationOptions = () => {
      const title = LangService.strings.APP_NAME;
      return {
        title,
        headerRight: null,
        ...TabBarStyles.guide,
      };
    };

    render() {
      return (<View />);
    }
}
