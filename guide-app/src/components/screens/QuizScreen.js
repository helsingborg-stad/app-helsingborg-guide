// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View
} from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles } from "@assets/styles";
import QuizView from "@shared-components/QuizView";
import {
  QuizItem,
  QuizPrompt,
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
        this.scrollToBottom();
        if (
          nextItem &&
          (item.type === "bot" ||
            item.type === "botimage" ||
            item.type === "user")
        ) {
          this.timeout = setTimeout(this.displayNextItem, 1000);
        }
      }
    );
  };

  handlePromptAlternativeSelected = (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => {
    const followUps = (alternative.followups || []).map((followUp, index) => ({
      id: `${Math.random()}-${index}`,
      type: "bot",
      text: followUp.text
    }));

    const newPromptItems = [];
    if (typeof alternative.correct === "boolean" && !alternative.correct) {
      const newPromptItem = {
        ...item,
        id: `${item.id}-alt`,
        alternatives: item.alternatives.filter(x => x !== alternative)
      };
      newPromptItems.push(newPromptItem);
    }

    this.upcomingItems = [
      { id: String(Math.random()), type: "user", text: alternative.text },
      ...followUps,
      ...newPromptItems,
      ...this.upcomingItems
    ];

    this.setState(({ items }) => {
      return { items: items.slice(1) };
    }, this.displayNextItem);
  };

  scrollToBottom() {
    const flatlist = this.flatlistRef.current;
    flatlist?.scrollToOffset({ offset: 0 });
  }

  timeout: TimeoutID;
  upcomingItems: QuizItem[] = [...dunkersSwedishQuizItems];
  flatlistRef = React.createRef<FlatList>();

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <SafeAreaView style={styles.container}>
          <QuizView
            flatlistRef={this.flatlistRef}
            items={this.state.items}
            onPromptAlternativeSelected={this.handlePromptAlternativeSelected}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});

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
