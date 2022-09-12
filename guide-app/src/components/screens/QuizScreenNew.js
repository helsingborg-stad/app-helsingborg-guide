// @flow
import React, { createRef, useEffect, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from "@react-navigation/native";
import { Colors } from "@assets/styles";
import QuizView from "@shared-components/QuizView";
import useStateCallback from "@hooks/useStateCallback";
import { AnalyticsUtils } from "@utils";
import {
  setLatestQuestionIdAction,
  selectDialogChoiceAction,
  resetDialogChoicesAction,
} from "@actions/quizActions";

type Props = {
  navigation: Object,
  route: Object,
};

const buildHistory = (
  history: QuizItem[],
  selectedChoices: DialogChoice[]
): QuizItem[] => {
  const builtHistory = history.flatMap((quizItem) => {
    if (quizItem.type === "button" || quizItem.type === "dialog") {
      const filteredChoices = selectedChoices.filter(
        (choice) => choice.questionId === quizItem.id
      );
      const uniqueAnswers = filteredChoices.reduce((acc, current) => {
        const x = acc.find(
          (item) => item.alternativeId === current.alternativeId
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      return uniqueAnswers.flatMap((choice, index) => {
        const selectedAlternative = quizItem.alternatives.find(
          (alt) => alt.id === choice.alternativeId
        );

        if (!selectedAlternative) {
          return [];
        }

        const followUps = (selectedAlternative.followups || []).map(
          (followUp) => ({
            id: followUp.id,
            type: "bot",
            text: followUp.text,
          })
        );

        let records = [];
        // Only show the dialog record for the first choice (when interactive skipRecord is used)
        if (quizItem.type === "dialog" && index === 0) {
          records = [
            {
              id: `${quizItem.id}-record`,
              type: "dialogrecord",
              icon: quizItem.icon,
              title: quizItem.title,
              message: quizItem.message,
            },
          ];
        }

        return [
          ...records,
          {
            id: `${quizItem.id}-resp-${index}`,
            type: "user",
            text: selectedAlternative.text,
          },
          ...followUps,
        ];
      });
    }
    return quizItem;
  });

  builtHistory.reverse();

  return builtHistory;
};

const QuizScreen = (props: Props) => {
  const { navigation, route } = props || {};
  const { params } = route || {};
  const { quiz } = params || {};
  const dispatch = useDispatch();
  const { latestQuestionId, selectedDialogChoiceIds } =
    useSelector((s) => s.quiz) || {};

  const quizItems = [...quiz.steps];
  const startItem = quizItems.find((item) => item.type === "start");
  const latestQuestionIndex = quizItems.findIndex(
    (element) => element.id === latestQuestionId
  );
  let upcomingItems =
    latestQuestionIndex > 0
      ? quizItems.slice(latestQuestionIndex)
      : [...quizItems];

  let timeout = null;

  const [botIsTyping, setBotIsTyping] = useState(false);
  const [items, setItems] = useStateCallback(
    buildHistory(
      latestQuestionIndex > 0 ? quizItems.slice(0, latestQuestionIndex) : [],
      selectedDialogChoiceIds
    )
  );

  const flatlistRef = createRef<FlatList>();

  useEffect(() => {
    if (latestQuestionIndex) {
      displayNextItem();
    }
    return () => timeout && clearTimeout(timeout);
  }, []);

  const displayNextItem = (_newItems) => {
    const item = upcomingItems[0];
    upcomingItems.splice(0, 1);
    const nextItem = upcomingItems[0];

    // enable for debugging result screen
    // this.timeout = setTimeout(this.handleQuizFinished, 500);

    setBotIsTyping(false);

    if (!item) {
      return;
    }

    let delayToNextItem = 1200;
    if (item.type === "bot") {
      const longMessageLength = 60;
      const textLengthFactor = Math.min(
        1.0,
        item.text.length / longMessageLength
      );
      delayToNextItem = 1000 + 1500 * textLengthFactor;
    } else if (item.type === "image") {
      delayToNextItem = 1200;
    }

    setItems(
      (prevItems) => [...(_newItems ? _newItems : prevItems), item],
      (newItems) => {
        scrollToBottom();
        if (
          nextItem &&
          (item.type === "chapter" ||
            item.type === "text_message" ||
            item.type === "image" ||
            item.type === "user" ||
            item.type === "dialogrecord")
        ) {
          if (item.type === "chapter") {
            AnalyticsUtils.logEvent("quiz_chapter_reached", {
              name: quiz.title,
              id: item.id,
            });
          }
          setBotIsTyping(
            nextItem.type === "text_message" || nextItem.type === "image"
          );
          timeout = setTimeout(displayNextItem, delayToNextItem);
        } else if (item.type === "start") {
          displayNextItem();
        } else if (!nextItem && item.type !== "button") {
          timeout = setTimeout(handleQuizFinished, 500);
        } else {
          dispatch(setLatestQuestionIdAction(newItems[0].id));
        }
      }
    );
  };

  const handlePromptAlternativeSelected = (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => {
    // create items for all follow up messages
    const followUps = (alternative.followups || []).map((followUp) => ({
      id: followUp.id,
      type: "bot",
      text: followUp.text,
    }));

    // if the user selected an incorrect answer, create a new prompt item without the incorrect alternative
    const newPromptItems = [];
    if (typeof alternative.correct === "boolean" && !alternative.correct) {
      const newPromptItem = {
        ...item,
        key: `${item.id}`,
        alternatives: item.alternatives.filter((x) => x.id !== alternative.id),
      };
      newPromptItems.push(newPromptItem);
    }

    // add all new upcoming items
    upcomingItems = [
      { id: `${alternative.id}-resp`, type: "user", text: alternative.text },
      ...followUps,
      ...newPromptItems,
      ...upcomingItems,
    ];

    dispatch(
      selectDialogChoiceAction({
        questionId: item.id,
        alternativeId: alternative.id,
      })
    );

    // remove the original prompt item display next item
    let newItems = items.slice(1);
    setItems(newItems, () => {
      displayNextItem();
    });
  };

  const handleDialogAlternativeSelected = (
    item: QuizDialog,
    alternative: QuizDialogAlternative
  ) => {
    const records = [];
    if (!item.skipRecord) {
      records.push({
        id: `${item.id}-record`,
        type: "dialogrecord",
        icon: item.icon,
        title: item.title,
        message: item.message,
      });
    }

    // create items for all follow up messages
    const followUps = (alternative.followups || []).map((followUp) => ({
      id: followUp.id,
      type: "bot",
      text: followUp.text,
    }));

    // if the user selected an incorrect answer, create a new dialog item without the incorrect alternative
    const newDialogItems = [];
    if (typeof alternative.correct === "boolean" && !alternative.correct) {
      newDialogItems.push({
        ...item,
        key: `${item.id}`,
        alternatives: item.alternatives.filter((x) => x.id !== alternative.id),
        skipRecord: true,
      });
    }

    // add all new upcoming items
    upcomingItems = [
      ...records,
      { id: `${alternative.id}-resp`, type: "user", text: alternative.text },
      ...followUps,
      ...newDialogItems,
      ...upcomingItems,
    ];
    dispatch(
      selectDialogChoiceAction({
        questionId: item.id,
        alternativeId: alternative.id,
      })
    );

    // remove the original dialog item display next item
    let newItems = items.slice(1);
    setItems(
      () => [...newItems],
      (_newItems) => {
        displayNextItem(_newItems);
      }
    );
  };

  const handleQuizFinished = () => {
    dispatch(setLatestQuestionIdAction(""));
    dispatch(resetDialogChoicesAction());
    navigation.dispatch(
      StackActions.replace("QuizResultScreen", {
        title: route.params.title,
        quiz: quiz,
      })
    );
  };

  const handleQuizStartAction = () => {
    displayNextItem();
  };

  const scrollToBottom = () => {
    const flatlist = flatlistRef.current;
    flatlist?.scrollToOffset({ offset: 0 });
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      <QuizView
        flatlistRef={flatlistRef}
        items={items}
        startItem={startItem}
        botIsTyping={botIsTyping}
        onPromptAlternativeSelected={handlePromptAlternativeSelected}
        onDialogAlternativeSelected={handleDialogAlternativeSelected}
        onQuizStartAction={handleQuizStartAction}
      />
    </>
  );
};

export default QuizScreen;
