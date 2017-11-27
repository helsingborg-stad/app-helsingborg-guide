import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
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

const GuideList = ({ items }) => (
  <FlatList
    data={items}
    renderItem={({ item }) => <Text>{item.name}</Text>}
    keyExtractor={item => item.id}
  />
);

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

  _renderScene = ({ route }) => {
    console.log(route);
    // TODO fetch items for the correct routes
    const { guides } = this.props;
    return (<GuideList items={guides} />);
  }


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
  const { guides } = state;
  return {
    isFetching,
    items,
    guides,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideListScreen);
