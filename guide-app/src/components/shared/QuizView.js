import React, { useState, useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors, TextStyles } from "@assets/styles";
import LangService from "@services/langService";
import Button from "@shared-components/Button";
import SelectableButton from "@shared-components/SelectableButton";
const dialogLookImage = require("@assets/images/quiz/dialog-look.png");
const dialogQuestionImage = require("@assets/images/quiz/dialog-question.png");
const dialogTalkImage = require("@assets/images/quiz/dialog-talk.png");

const nonEmojiRegExp = /[a-zA-Z0-9.!?…]/;

function Chapter({ item }: { item: QuizChapter }) {
  return <Text style={styles.chapter}>{item.text}</Text>;
}

function containsNonEmoji(text: string): Boolean {
  return !!text.match(nonEmojiRegExp);
}

function isBotNonEmoji(item: ?QuizItem) {
  return (
    item?.type === "dialogrecord" ||
    (item?.type === "bot" && containsNonEmoji(item.text))
  );
}

function BotMessageBlob({
  children,
  prevItem,
  nextItem
}: {
  children: React.ReactNode,
  prevItem: ?QuizItem,
  nextItem: ?QuizItem
}) {
  let style = styles.botMessageSolo;
  if (isBotNonEmoji(nextItem) && isBotNonEmoji(prevItem)) {
    style = styles.botMessageMiddle;
  } else if (isBotNonEmoji(prevItem)) {
    style = styles.botMessageFirst;
  } else if (isBotNonEmoji(nextItem)) {
    style = styles.botMessageLast;
  }
  return <View style={style}>{children}</View>;
}

function BotMessage({
  item,
  prevItem,
  nextItem
}: {
  item: QuizBotMessage,
  prevItem: ?QuizItem,
  nextItem: ?QuizItem
}) {
  if (!containsNonEmoji(item.text)) {
    return <Text style={styles.botMessageEmoji}>{item.text}</Text>;
  }
  return (
    <BotMessageBlob prevItem={prevItem} nextItem={nextItem}>
      <Text style={styles.botMessageText}>{item.text}</Text>
    </BotMessageBlob>
  );
}

function BotImageMessage({ item }: { item: QuizBotImageMessage }) {
  return (
    <ImageBackground
      style={[styles.botImage, { aspectRatio: item.aspectRatio }]}
      imageStyle={styles.botImageImage}
      source={item.source}
      resizeMode="contain"
    />
  );
}

function UserMessage({
  item,
  prevItem,
  nextItem
}: {
  item: QuizUserMessage,
  prevItem: ?QuizItem,
  nextItem: ?QuizItem
}) {
  let style = styles.userMessageSolo;
  if (prevItem?.type !== "user" && nextItem?.type !== "user") {
    style = styles.userMessageSoloVerticalMargin;
  } else if (prevItem?.type !== "user") {
    style = styles.userMessageSoloTopMargin;
  } else if (nextItem?.type !== "user") {
    style = styles.userMessageSoloBottomMargin;
  }

  return (
    <LinearGradient
      colors={[Colors.themePrimary, Colors.themeTertiary]}
      useAngle
      angle={90 - 22}
      style={style}
    >
      <Text style={styles.userMessageText}>{item.text}</Text>
    </LinearGradient>
  );
}

function Prompt({
  item,
  onAlternativeSelected
}: {
  item: QuizPrompt,
  onAlternativeSelected: (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => void
}) {
  return (
    <View style={styles.promptContainer}>
      {item.alternatives.map((alternative, index) => (
        <Button
          key={index}
          style={styles.promptButton}
          title={alternative.text}
          onPress={() => {
            onAlternativeSelected(item, alternative);
          }}
        />
      ))}
    </View>
  );
}

function DialogIcon({ style, icon }: { style: any, icon: QuizDialogIcon }) {
  let image;
  if (icon === "look") {
    image = dialogLookImage;
  } else if (icon === "question") {
    image = dialogQuestionImage;
  } else if (icon === "talk") {
    image = dialogTalkImage;
  } else {
    return null;
  }
  return <Image style={style} resizeMode="center" source={image} />;
}

function Dialog({
  item,
  onHeightChanged,
  onAlternativeSelected,
  isPrompt
}: {
  item: QuizDialog,
  onHeightChanged: (height: number) => void,
  onAlternativeSelected: (
    item: QuizDialog,
    alternative: QuizDialogAlternative
  ) => void,
  isPrompt: boolean
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const { alternatives } = item;
  let buttons;
  if (isPrompt || alternatives.length === 1) {
    // const alternative = alternatives[0];
    buttons = alternatives.map(alternative => (
      <Button
        style={styles.promptButton}
        title={alternative.text}
        onPress={() => onAlternativeSelected(item, alternative)}
      />
    ));
  } else {
    buttons = (
      <>
        {alternatives.map((alternative, index) => (
          <SelectableButton
            key={index}
            style={styles.dialogOptionButton}
            title={alternative.text}
            selected={alternative === selectedAlternative}
            onPress={() => setSelectedAlternative(alternative)}
          />
        ))}
        <Button
          style={styles.dialogSendButton}
          title={LangService.strings.SEND}
          onPress={() => onAlternativeSelected(item, selectedAlternative)}
          enabled={!!selectedAlternative}
        />
      </>
    );
  }

  return (
    <SafeAreaView
      style={styles.dialogContainer}
      onLayout={event => onHeightChanged(event.nativeEvent.layout.height)}
    >
      {!isPrompt && (
        <>
          <DialogIcon style={styles.dialogIcon} icon={item.icon} />
          <Text style={styles.dialogTitle}>{item.title}</Text>
          <Text style={styles.dialogInstructions}>{item.instructions}</Text>
          <Text style={styles.dialogMessage}>{item.message}</Text>
        </>
      )}
      {buttons}
    </SafeAreaView>
  );
}

function DialogRecord({
  item,
  prevItem,
  nextItem
}: {
  item: QuizDialogRecord,
  prevItem: ?QuizItem,
  nextItem: ?QuizItem
}) {
  return (
    <BotMessageBlob prevItem={prevItem} nextItem={nextItem}>
      <DialogIcon style={styles.dialogRecordIcon} icon={item.icon} />
      <Text style={styles.botMessageText}>{item.title}</Text>
      <Text style={styles.dialogRecordMessage}>{item.message}</Text>
    </BotMessageBlob>
  );
}

const QuizStart = ({
  item,
  onQuizStartAction,
  isHistoryItem
}: {
  item: QuizItem,
  onQuizStartAction: () => void,
  isHistoryItem: boolean
}) => (
    <View style={styles.startContainer}>
      <View>
        <StartImage item={item.image} />
        <StartText item={item} />
      </View>
      {!isHistoryItem && (
        <StartAction item={item.action} onQuizStartAction={onQuizStartAction} />
      )}
    </View>
  );

const StartText = ({ item }: { item: QuizItem }) => (
  <View style={styles.startTextContainer}>
    <Text style={styles.startText}>{item.text}</Text>
  </View>
);

const StartAction = ({
  item,
  onQuizStartAction
}: {
  item: QuizPrompt,
  onQuizStartAction: () => void
}) => {
  return (
    <View style={styles.promptContainer}>
      <Button
        style={styles.promptButton}
        title={item.text}
        onPress={() => {
          onQuizStartAction(item);
        }}
      />
    </View>
  );
};

function StartImage({ item }): { item: QuizBotImageMessage } {
  return (
    <ImageBackground
      style={[styles.startImage, { aspectRatio: item.aspectRatio }]}
      imageStyle={styles.startImageImage}
      source={item.source}
      resizeMode="contain"
    />
  );
}

const TypingIndicator = () => {
  const firstAnim = useRef(new Animated.Value(1)).current;
  const secondAnim = useRef(new Animated.Value(1)).current;
  const thirdAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.stagger(150, [
        Animated.sequence([
          Animated.timing(firstAnim, {
            toValue: 0.5,
            duration: 500
          }),
          Animated.timing(firstAnim, {
            toValue: 1,
            duration: 250
          })
        ]),
        Animated.sequence([
          Animated.timing(secondAnim, {
            toValue: 0.5,
            duration: 500
          }),
          Animated.timing(secondAnim, {
            toValue: 1,
            duration: 250
          })
        ]),
        Animated.sequence([
          Animated.timing(thirdAnim, {
            toValue: 0.5,
            duration: 500
          }),
          Animated.timing(thirdAnim, {
            toValue: 1,
            duration: 250
          })
        ])
      ]),
      {
        iterations: -1
      }
    ).start();
  }, [firstAnim, secondAnim, thirdAnim]);

  return (
    <View style={styles.typingIndicatorContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: firstAnim,
            transform: [
              {
                translateY: firstAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [-7, 0]
                })
              }
            ]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: secondAnim,
            transform: [
              {
                translateY: secondAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [-7, 0]
                })
              }
            ]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: thirdAnim,
            transform: [
              {
                translateY: thirdAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [-7, 0]
                })
              }
            ]
          }
        ]}
      />
    </View>
  );
};

function renderFlatListItem(
  item: QuizItem,
  prevItem: ?QuizItem,
  nextItem: ?QuizItem,
  onPromptAlternativeSelected: (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => void,
  onQuizStartAction: () => void
) {
  if (item.type === "chapter") {
    return <Chapter key={item.id} item={item} />;
  } else if (item.type === "typing") {
    return (
      <TypingIndicator
        key="typing-indicator"
        prevItem={prevItem}
        nextItem={nextItem}
      />
    );
  } else if (item.type === "bot") {
    return (
      <BotMessage
        key={item.id}
        item={item}
        prevItem={prevItem}
        nextItem={nextItem}
      />
    );
  } else if (item.type === "botimage") {
    return <BotImageMessage key={item.id} item={item} />;
  } else if (item.type === "user") {
    return (
      <UserMessage
        key={item.id}
        item={item}
        prevItem={prevItem}
        nextItem={nextItem}
      />
    );
  } else if (item.type === "prompt") {
    // return (
    //   <Prompt
    //     key={item.id}
    //     item={item}
    //     onAlternativeSelected={onPromptAlternativeSelected}
    //   />
    // );
  } else if (item.type === "dialogrecord") {
    return (
      <DialogRecord
        key={item.id}
        item={item}
        prevItem={prevItem}
        nextItem={nextItem}
      />
    );
  } else if (item.type === "start") {
    return (
      <QuizStart
        key={item.id}
        item={item}
        onQuizStartAction={onQuizStartAction}
        isHistoryItem
      />
    );
  }
  return null;
}

export default function QuizView({
  items,
  startItem,
  onPromptAlternativeSelected,
  onDialogAlternativeSelected,
  onQuizStartAction,
  flatlistRef,
  botIsTyping
}: {
  items: QuizItem[],
  startItem: QuizItem,
  onPromptAlternativeSelected: (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => void,
  onDialogAlternativeSelected: (
    item: QuizDialog,
    alternative: QuizDialogAlternative
  ) => void,
  onQuizStartAction: () => void,
  flatlistRef: React.Ref<FlatList>,
  botIsTyping: boolean
}) {
  const [dialogHeight, setDialogHeight] = useState();
  const [promptHeight, setPromptHeight] = useState();
  const dialogItem = items[0]?.type === "dialog" ? items[0] : null;
  const promptItem = items[0]?.type === "prompt" ? items[0] : null;
  return (
    <>
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatlistRef}
          inverted={items.length > 0} // This is a workaround for RN bug https://github.com/facebook/react-native/issues/21196
          data={items}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item, index }) => {
            const prevItem = items[index - 1];
            const nextItem = items[index + 1];
            return renderFlatListItem(
              item,
              prevItem,
              nextItem,
              onPromptAlternativeSelected,
              onQuizStartAction
            );
          }}
          ListEmptyComponent={() => (
            <QuizStart item={startItem} onQuizStartAction={onQuizStartAction} />
          )}
          ListHeaderComponent={() => {
            if (dialogItem) {
              return (
                <View
                  style={{
                    height: dialogHeight
                  }}
                />
              );
            }

            if (promptItem) {
              return (
                <View
                  style={{
                    height: promptHeight
                  }}
                />
              );
            }

            if (botIsTyping) {
              return <TypingIndicator />;
            }

            return null;
          }}
        />
      </SafeAreaView>
      {dialogItem && (
        <Dialog
          item={dialogItem}
          onHeightChanged={setDialogHeight}
          onAlternativeSelected={onDialogAlternativeSelected}
        />
      )}
      {promptItem && (
        <Dialog
          item={promptItem}
          isPrompt
          onHeightChanged={setPromptHeight}
          onAlternativeSelected={onPromptAlternativeSelected}
        />
      )}
    </>
  );
}

const radiusSmall = 7;
const radiusLarge = 20;
const radiusMax = 30;

const botMessageShared = {
  alignSelf: "flex-start",
  marginHorizontal: 11,
  marginBottom: 4,
  maxWidth: "80%",
  backgroundColor: "#E8E8E9",
  paddingHorizontal: 17,
  paddingVertical: 11,
  borderTopLeftRadius: radiusMax,
  borderTopRightRadius: radiusMax,
  borderBottomRightRadius: radiusMax,
  borderBottomLeftRadius: radiusMax
};

const userMessageShared = {
  alignSelf: "flex-end",
  marginHorizontal: 11,
  marginBottom: 4,
  maxWidth: "80%",
  paddingHorizontal: 17,
  paddingVertical: 11,
  borderRadius: radiusMax
};

const dialogIconShared = {
  borderRadius: 24,
  width: 48,
  height: 48,
  backgroundColor: Colors.black
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray12
  },
  chapter: StyleSheet.flatten([
    TextStyles.medium,
    {
      marginHorizontal: 11,
      marginTop: 40,
      marginBottom: 44,
      textAlign: "center",
      fontWeight: "bold",
      color: Colors.gray2C
    }
  ]),
  botMessageEmoji: StyleSheet.flatten([
    TextStyles.body,
    {
      marginLeft: 11,
      marginTop: 6,
      marginBottom: 10,
      maxWidth: "80%",
      fontSize: 30,
      lineHeight: 36
    }
  ]),
  botMessageSolo: botMessageShared,
  botMessageFirst: {
    ...botMessageShared,
    borderTopLeftRadius: radiusLarge,
    borderBottomLeftRadius: radiusSmall
  },
  botMessageMiddle: {
    ...botMessageShared,
    borderTopLeftRadius: radiusSmall,
    borderBottomLeftRadius: radiusSmall
  },
  botMessageLast: {
    ...botMessageShared,
    borderTopLeftRadius: radiusSmall,
    borderBottomLeftRadius: radiusLarge
  },
  botMessageText: TextStyles.body,
  botImage: {
    alignSelf: "flex-start",
    marginHorizontal: 11,
    marginBottom: 4,
    width: 300
  },
  startContainer: {
    justifyContent: "space-between",
    flexDirection: "column",
    flexGrow: 1
  },
  startImage: {
    marginHorizontal: 11,
    marginTop: 24,
    alignSelf: "center",
    width: 300
  },
  startImageImage: {
    borderRadius: 500
  },
  startTextContainer: {
    marginVertical: 21,
    marginHorizontal: 51
  },
  startText: {
    ...TextStyles.description,
    fontSize: 11,
    lineHeight: 18,
    color: "#979797"
  },
  botImageImage: {
    borderRadius: 10
  },
  typingIndicatorContainer: {
    ...botMessageShared,
    flexDirection: "row"
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 100,
    backgroundColor: "#B4B5B9",
    marginHorizontal: 2
  },
  userMessageSolo: userMessageShared,
  userMessageSoloVerticalMargin: {
    ...userMessageShared,
    marginTop: 20,
    marginBottom: 20 + userMessageShared.marginBottom
  },
  userMessageSoloTopMargin: {
    ...userMessageShared,
    marginTop: 20
  },
  userMessageSoloBottomMargin: {
    ...userMessageShared,
    marginBottom: 20 + userMessageShared.marginBottom
  },
  userMessageText: StyleSheet.flatten([
    TextStyles.body,
    { color: Colors.white }
  ]),
  promptContainer: {
    marginTop: 15
  },
  promptButton: {
    marginHorizontal: 11,
    marginVertical: 5
  },
  dialogContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  dialogIcon: {
    ...dialogIconShared,
    alignSelf: "center",
    marginTop: 32,
    marginBottom: 20
  },
  dialogRecordIcon: {
    ...dialogIconShared,
    alignSelf: "flex-start",
    marginBottom: 20
  },
  dialogTitle: StyleSheet.flatten([
    TextStyles.description,
    {
      marginHorizontal: 11,
      textAlign: "center",
      marginBottom: 4
    }
  ]),
  dialogInstructions: StyleSheet.flatten([
    TextStyles.description,
    {
      marginHorizontal: 11,
      marginBottom: 20,
      textAlign: "center",
      color: Colors.gray4
    }
  ]),
  dialogMessage: StyleSheet.flatten([
    TextStyles.body,
    {
      marginHorizontal: 11,
      marginBottom: 20,
      textAlign: "center",
      fontWeight: "bold"
    }
  ]),
  dialogOptionButton: {
    marginHorizontal: 28,
    marginVertical: 2
  },
  dialogSendButton: {
    marginHorizontal: 12,
    marginTop: 11,
    marginBottom: 5
  },
  dialogRecordMessage: StyleSheet.flatten([
    TextStyles.body,
    {
      marginTop: 10,
      fontWeight: "bold"
    }
  ])
});
