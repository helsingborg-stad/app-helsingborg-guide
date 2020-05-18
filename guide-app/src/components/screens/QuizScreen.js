// @flow
import { StackActions } from "react-navigation";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FlatList, StatusBar, View } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles } from "@assets/styles";
import QuizView from "@shared-components/QuizView";
import {
  setLatestQuestionIdAction,
  selectDialogChoiceAction,
  resetDialogChoicesAction
} from "@actions/quizActions";

type Props = {
  navigation: Object,
  latestQuestionId: string,
  selectedDialogChoiceIds: [string],
  setLatestQuestionId: string => void,
  selectDialogChoice: DialogChoice => void,
  resetDialogChoices: () => void
};

type State = {
  items: QuizItem[],
  botIsTyping: boolean
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

  static buildHistory = (
    history: QuizItem[],
    selectedChoices: DialogChoice[]
  ): QuizItem[] => {
    const builtHistory = history.flatMap(quizItem => {
      if (quizItem.type === "prompt" || quizItem.type === "dialog") {
        const filteredChoices = selectedChoices.filter(
          choice => choice.questionId === quizItem.id
        );

        const uniqueAnswers = filteredChoices.reduce((acc, current) => {
          const x = acc.find(
            item => item.alternativeId === current.alternativeId
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        return uniqueAnswers.flatMap((choice, index) => {
          const selectedAlternative = quizItem.alternatives.find(
            alt => alt.id === choice.alternativeId
          );

          if (!selectedAlternative) {
            return [];
          }

          const followUps = (selectedAlternative.followups || []).map(
            followUp => ({
              id: followUp.id,
              type: "bot",
              text: followUp.text
            })
          );

          let records = [];

          if (quizItem.type === "dialog") {
            records = [
              {
                id: `${quizItem.id}-record`,
                type: "dialogrecord",
                icon: quizItem.icon,
                title: quizItem.title,
                message: quizItem.message
              }
            ];
          }

          return [
            ...records,
            {
              id: `${quizItem.id}-resp-${index}`,
              type: "user",
              text: selectedAlternative.text
            },
            ...followUps
          ];
        });
      }

      return quizItem;
    });

    builtHistory.reverse();

    return builtHistory;
  };

  constructor(props) {
    super(props);

    const { quiz } = props.navigation.state.params;
    const quizItems = [...quiz.items];

    const latestQuestionIndex = quizItems.findIndex(
      element => element.id === props.latestQuestionId
    );

    this.upcomingItems =
      latestQuestionIndex > 0
        ? quizItems.splice(latestQuestionIndex)
        : [...quizItems];

    this.state = {
      botIsTyping: false,
      items: [
        ...QuizScreen.buildHistory(
          quizItems.splice(0, latestQuestionIndex),
          props.selectedDialogChoiceIds
        )
      ]
    };
  }

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

    this.setState({ botIsTyping: false });

    if (!item) {
      return;
    }

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
          this.setState({
            botIsTyping: nextItem.type === "bot" || nextItem.type === "botimage"
          });
          this.timeout = setTimeout(this.displayNextItem, delayToNextItem);
        } else if (!nextItem && item.type !== "prompt") {
          this.timeout = setTimeout(this.handleQuizFinished, 500);
        } else {
          this.props.setLatestQuestionId(this.state.items[0].id);
        }
      }
    );
  };

  handlePromptAlternativeSelected = (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => {
    // create items for all follow up messages
    const followUps = (alternative.followups || []).map(followUp => ({
      id: followUp.id,
      type: "bot",
      text: followUp.text
    }));

    // if the user selected an incorrect answer, create a new prompt item without the incorrect alternative
    const newPromptItems = [];
    if (typeof alternative.correct === "boolean" && !alternative.correct) {
      const newPromptItem = {
        ...item,
        key: `${item.id}`,
        alternatives: item.alternatives.filter(x => x.id !== alternative.id)
      };
      newPromptItems.push(newPromptItem);
    }

    // add all new upcoming items
    this.upcomingItems = [
      { id: `${alternative.id}-resp`, type: "user", text: alternative.text },
      ...followUps,
      ...newPromptItems,
      ...this.upcomingItems
    ];

    this.props.selectDialogChoice({
      questionId: item.id,
      alternativeId: alternative.id
    });

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
    const followUps = (alternative.followups || []).map(followUp => ({
      id: followUp.id,
      type: "bot",
      text: followUp.text
    }));

    // add all new upcoming items
    this.upcomingItems = [
      record,
      { id: `${alternative.id}-resp`, type: "user", text: alternative.text },
      ...followUps,
      ...this.upcomingItems
    ];

    this.props.selectDialogChoice({
      questionId: item.id,
      alternativeId: alternative.id
    });

    // remove the original dialog item display next item
    this.setState(({ items }) => {
      return { items: items.slice(1) };
    }, this.displayNextItem);
  };

  handleQuizFinished = () => {
    const { navigation } = this.props;
    this.props.setLatestQuestionId("");
    this.props.resetDialogChoices();
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
          botIsTyping={this.state.botIsTyping}
          onPromptAlternativeSelected={this.handlePromptAlternativeSelected}
          onDialogAlternativeSelected={this.handleDialogAlternativeSelected}
        />
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    latestQuestionId: state.quiz.latestQuestionId,
    selectedDialogChoiceIds: state.quiz.selectedDialogChoiceIds
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setLatestQuestionId: (latestQuestionId: string) =>
      dispatch(setLatestQuestionIdAction(latestQuestionId)),
    resetDialogChoices: () => dispatch(resetDialogChoicesAction()),
    selectDialogChoice: (dialogChoice: DialogChoice) =>
      dispatch(selectDialogChoiceAction(dialogChoice))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizScreen);
