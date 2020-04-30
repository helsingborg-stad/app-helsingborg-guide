// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StatusBar, SafeAreaView } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles } from "@assets/styles";
import QuizView from "@shared-components/QuizView";
import {
  QuizItem,
  QuizPromptAlternative,
  dunkersSwedishQuizItems
} from "../../data/QuizContent";

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

  componentDidMount() {
    this.displayNextItem();
  }

  componentWillUnmount() {
    // const { navigation } = this.props;
    // if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
    //   this.props.dispatchShowBottomBar(true);
    // }
    clearTimeout(this.timeout);
  }

  displayNextItem = () => {
    const item = this.upcomingItems[0];
    this.upcomingItems.splice(0, 1);
    const nextItem = this.upcomingItems[0];

    this.setState(
      ({ items }) => {
        return { items: [item, ...items] };
      },
      () => {
        if (nextItem && (item.type === "bot" || item.type === "user")) {
          this.timeout = setTimeout(this.displayNextItem, 1000);
        }
      }
    );
  };

  handlePromptAlternativeSelected = (alternative: QuizPromptAlternative) => {
    const followUps = (alternative.followups || []).map((followUp, index) => ({
      id: `${Math.random()}-${index}`,
      type: "bot",
      text: followUp.text
    }));
    this.upcomingItems = [
      { id: String(Math.random()), type: "user", text: alternative.text },
      ...followUps,
      ...this.upcomingItems
    ];

    this.setState(({ items }) => {
      return { items: items.slice(1) };
    }, this.displayNextItem);
  };

  timeout: TimeoutID;
  upcomingItems: QuizItem[] = [...dunkersSwedishQuizItems];

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <QuizView
            items={this.state.items}
            onPromptAlternativeSelected={this.handlePromptAlternativeSelected}
          />
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
