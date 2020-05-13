// @flow
import { StackActions } from "react-navigation";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList, StatusBar, View } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles } from "@assets/styles";
import QuizView from "@shared-components/QuizView";

type Props = {
  navigation: Object
};

type State = {
  items: QuizItem[]
};

class QuizScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { quiz } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title: quiz.name,
      headerRight: <View />,
      headerLeft: <HeaderBackButton navigation={navigation} />
    };
  };

  constructor(props: Props) {
    super(props);

    const { quiz } = props.navigation.state.params;
    this.upcomingItems = [...quiz.items];
  }

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

    let delayToNextItem = 400;
    if (item.type === "bot") {
      const longMessageLength = 60;
      const textLengthFactor = Math.min(
        1.0,
        item.text.length / longMessageLength
      );
      delayToNextItem = 700 + 800 * textLengthFactor;
    } else if (item.type === "botimage") {
      delayToNextItem = 600;
    }

    this.setState(
      ({ items }) => {
        return { items: [item, ...items] };
      },
      () => {
        this.scrollToBottom();
        if (
          nextItem &&
          (item.type === "chapter" ||
            item.type === "bot" ||
            item.type === "botimage" ||
            item.type === "user" ||
            item.type === "dialogrecord")
        ) {
          this.timeout = setTimeout(this.displayNextItem, delayToNextItem);
        } else if (!nextItem && item.type !== "prompt") {
          this.timeout = setTimeout(this.handleQuizFinished, 500);
        }
      }
    );
  };

  handlePromptAlternativeSelected = (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => {
    // create items for all follow up messages
    const followUps = (alternative.followups || []).map((followUp, index) => ({
      id: `${item.id}-fu${index}`,
      type: "bot",
      text: followUp.text
    }));

    // if the user selected an incorrect answer, create a new prompt item without the incorrect alternative
    const newPromptItems = [];
    if (typeof alternative.correct === "boolean" && !alternative.correct) {
      const newPromptItem = {
        ...item,
        id: `${item.id}-alt`,
        alternatives: item.alternatives.filter(x => x !== alternative)
      };
      newPromptItems.push(newPromptItem);
    }

    // add all new upcoming items
    this.upcomingItems = [
      { id: `${item.id}-resp`, type: "user", text: alternative.text },
      ...followUps,
      ...newPromptItems,
      ...this.upcomingItems
    ];

    // remove the original prompt item display next item
    this.setState(({ items }) => {
      return { items: items.slice(1) };
    }, this.displayNextItem);
  };

  handleDialogAlternativeSelected = (
    item: QuizDialog,
    alternative: QuizDialogAlternative
  ) => {
    const record = {
      id: `${item.id}-record`,
      type: "dialogrecord",
      icon: item.icon,
      title: item.title,
      message: item.message
    };

    // create items for all follow up messages
    const followUps = (alternative.followups || []).map((followUp, index) => ({
      id: `${item.id}-fu${index}`,
      type: "bot",
      text: followUp.text
    }));

    // add all new upcoming items
    this.upcomingItems = [
      record,
      { id: `${item.id}-resp`, type: "user", text: alternative.text },
      ...followUps,
      ...this.upcomingItems
    ];

    // remove the original dialog item display next item
    this.setState(({ items }) => {
      return { items: items.slice(1) };
    }, this.displayNextItem);
  };

  handleQuizFinished = () => {
    const { navigation } = this.props;
    navigation.dispatch(
      StackActions.replace({
        routeName: "QuizResultScreen",
        params: {
          title: navigation.state.params.title
        }
      })
    );
  };

  scrollToBottom() {
    const flatlist = this.flatlistRef.current;
    flatlist?.scrollToOffset({ offset: 0 });
  }

  timeout: TimeoutID;
  upcomingItems: QuizItem[];
  flatlistRef = React.createRef<FlatList>();

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <QuizView
          flatlistRef={this.flatlistRef}
          items={this.state.items}
          onPromptAlternativeSelected={this.handlePromptAlternativeSelected}
          onDialogAlternativeSelected={this.handleDialogAlternativeSelected}
        />
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
