import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ImageBackground
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors, TextStyles } from "@assets/styles";
import Button from "@shared-components/Button";
import { QuizItem } from "../../data/QuizContent";

const nonEmojiRegExp = /[a-zA-Z0-9.!?…]/;

function containsNonEmoji(text: string): Boolean {
  return !!text.match(nonEmojiRegExp);
}

function isBotNonEmoji(item: ?QuizItem) {
  return item?.type === "bot" && containsNonEmoji(item.text);
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
  let style = styles.botMessageSolo;
  if (isBotNonEmoji(nextItem) && isBotNonEmoji(prevItem)) {
    style = styles.botMessageMiddle;
  } else if (isBotNonEmoji(prevItem)) {
    style = styles.botMessageFirst;
  } else if (isBotNonEmoji(nextItem)) {
    style = styles.botMessageLast;
  }
  return (
    <View style={style}>
      <Text style={styles.botMessageText}>{item.text}</Text>
    </View>
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
  onAlternativeSelected: (alternative: QuizPromptAlternative) => void
}) {
  return (
    <View style={styles.promptContainer}>
      {item.alternatives.map((alternative, index) => (
        <Button
          key={index}
          style={styles.promptButton}
          title={alternative.text}
          onPress={() => {
            onAlternativeSelected(alternative);
          }}
        />
      ))}
    </View>
  );
}

export default function QuizView({
  items,
  onPromptAlternativeSelected,
  flatlistRef
}: {
  items: QuizItem[],
  onPromptAlternativeSelected: (alternative: QuizPromptAlternative) => void,
  flatlistRef: React.Ref<FlatList>
}) {
  return (
    <FlatList
      ref={flatlistRef}
      inverted
      data={items}
      renderItem={({ item, index }) => {
        const prevItem = items[index - 1];
        const nextItem = items[index + 1];
        if (item.type === "bot") {
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
        }
        return null;
      }}
    />
  );
}

const radiusSmall = 15;
const radiusLarge = 35;
const radiusMax = 1000;

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

const styles = StyleSheet.create({
  botMessageEmoji: StyleSheet.flatten([
    TextStyles.normal,
    {
      marginLeft: 11,
      marginTop: 6,
      marginBottom: 10,
      maxWidth: "80%",
      fontSize: 30
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
  botMessageText: TextStyles.normal,
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
    TextStyles.normal,
    { color: Colors.white }
  ]),
  promptContainer: {
    marginTop: 15
  },
  promptButton: {
    marginHorizontal: 11,
    marginVertical: 5
  }
});
