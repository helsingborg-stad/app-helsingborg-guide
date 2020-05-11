import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors, TextStyles } from "@assets/styles";
import Button from "@shared-components/Button";
import { QuizItem } from "../../data/QuizContent";
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
  onAlternativeSelected
}: {
  item: QuizDialog,
  onAlternativeSelected: (
    item: QuizDialog,
    alternative: QuizDialogAlternative
  ) => void
}) {
  return (
    <View style={styles.dialogContainer}>
      <DialogIcon style={styles.dialogIcon} icon={item.icon} />
      <Text style={styles.dialogTitle}>{item.title}</Text>
      <Text style={styles.dialogInstructions}>{item.instructions}</Text>
      <Text style={styles.dialogMessage}>{item.message}</Text>
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

export default function QuizView({
  items,
  onPromptAlternativeSelected,
  onDialogAlternativeSelected,
  flatlistRef
}: {
  items: QuizItem[],
  onPromptAlternativeSelected: (
    item: QuizPrompt,
    alternative: QuizPromptAlternative
  ) => void,
  onDialogAlternativeSelected: (
    item: QuizDialog,
    alternative: QuizDialogAlternative
  ) => void,
  flatlistRef: React.Ref<FlatList>
}) {
  return (
    <FlatList
      ref={flatlistRef}
      inverted
      data={items}
      style={styles.list}
      renderItem={({ item, index }) => {
        const prevItem = items[index - 1];
        const nextItem = items[index + 1];
        if (item.type === "chapter") {
          return <Chapter key={item.id} item={item} />;
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
          return (
            <Prompt
              key={item.id}
              item={item}
              onAlternativeSelected={onPromptAlternativeSelected}
            />
          );
        } else if (item.type === "dialog") {
          return (
            <Dialog
              key={item.id}
              item={item}
              onAlternativeSelected={onDialogAlternativeSelected}
            />
          );
        } else if (item.type === "dialogrecord") {
          return (
            <DialogRecord
              key={item.id}
              item={item}
              prevItem={prevItem}
              nextItem={nextItem}
            />
          );
        }
        return null;
      }}
    />
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
  backgroundColor: Colors.themeSecondary
};

const styles = StyleSheet.create({
  list: { backgroundColor: Colors.gray12 },
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
  botImageImage: {
    borderRadius: 10
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
    backgroundColor: Colors.white,
    paddingTop: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 15
  },
  dialogIcon: {
    ...dialogIconShared,
    alignSelf: "center",
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
  dialogRecordMessage: StyleSheet.flatten([
    TextStyles.body,
    {
      marginTop: 10,
      fontWeight: "bold"
    }
  ])
});
