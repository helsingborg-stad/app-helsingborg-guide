import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, SceneMap, TabBar } from "react-native-tab-view";
import LangService from "../../services/langService";
import TabBarStyles from "../../styles/TabBarStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});

const FirstRoute = () => <View style={[styles.container, { backgroundColor: "#ff4081" }]} />;
const SecondRoute = () => <View style={[styles.container, { backgroundColor: "#673ab7" }]} />;

class GuideListScreen extends Component {
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

    const { items } = this.props;
    const routes = [];

    items.forEach((element) => {
      routes.push({ key: `${element.id}`, title: element.name });
    });

    this.state = {
      index: 0,
      routes,
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  /*
  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  */

  // TODO fetch and render the content in every category
  _renderScene = ({ route }) => FirstRoute()

  render() {
    const { isFetching } = this.props;

    if (isFetching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

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

function mapStateToProps(state) {
  const { isFetching, items } = state.guideTypes;
  return {
    isFetching, items,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideListScreen);
