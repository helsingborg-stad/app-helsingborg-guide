import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { TabViewAnimated, SceneMap, TabBar } from "react-native-tab-view";
import LangService from "../../services/langService";
import TabBarStyles from "../../styles/TabBarStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const FirstRoute = () => <View style={[styles.container, { backgroundColor: "#ff4081" }]} />;
const SecondRoute = () => <View style={[styles.container, { backgroundColor: "#673ab7" }]} />;

export default class GuideListScreen extends Component {
  static navigationOptions = () => {
    const title = LangService.strings.APP_NAME;
    return {
      title,
      headerRight: null,
      ...TabBarStyles.guide,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "First" },
        { key: "second", title: "Second" },
      ],
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}
