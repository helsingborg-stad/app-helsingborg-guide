// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StatusBar, SafeAreaView } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles } from "@assets/styles";
import QuizView from "@shared-components/QuizView";
import { dunkersSwedishQuizItems } from "../../data/QuizContent";

type Props = {
  navigation: Object
};

type State = {
  items: QuizItem[]
};

class QuizScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: <View />,
      headerLeft: <HeaderBackButton navigation={navigation} />
    };
  };

  state = { items: [] };

  componentWillMount() {
    const upcomingItems = [...dunkersSwedishQuizItems];
    this.interval = setInterval(() => {
      const item = upcomingItems[0];
      upcomingItems.splice(0, 1);
      this.setState({ items: [item, ...this.state.items] });
      if (upcomingItems.length === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  componentWillUnmount() {
    // const { navigation } = this.props;
    // if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
    //   this.props.dispatchShowBottomBar(true);
    // }
    clearInterval(this.interval);
  }

  interval: IntervalID;

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <QuizView items={this.state.items} />
        </SafeAreaView>
      </>
    );
  }
}

function mapStateToProps(unusedState: RootState) {
  return {};
}

function mapDispatchToProps(unusedDispatch: Dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizScreen);
