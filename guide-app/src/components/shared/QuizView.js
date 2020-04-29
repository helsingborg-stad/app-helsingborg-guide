import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { TextStyles } from "@assets/styles";
import { dunkersSwedishQuizItems } from "../../data/QuizContent";

const nonEmojiRegExp = /[a-zA-Z0-9.!?]/;

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
    console.log("MIDDLE", { item, prevItem, nextItem });
  } else if (isBotNonEmoji(prevItem)) {
    style = styles.botMessageFirst;
    console.log("FIRST", { item, prevItem, nextItem });
  } else if (isBotNonEmoji(nextItem)) {
    style = styles.botMessageLast;
    console.log("LAST", { item, prevItem, nextItem });
  } else {
    console.log("SOLO", { item, prevItem, nextItem });
  }
  return (
    <View style={style}>
      <Text style={styles.botMessageText}>{item.text}</Text>
    </View>
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
    <View style={style}>
      <Text style={styles.userMessageText}>{item.text}</Text>
    </View>
  );
}

export default function QuizView() {
  const items = dunkersSwedishQuizItems;
  return (
    <FlatList
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
        } else if (item.type === "user") {
          return (
            <UserMessage
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
  backgroundColor: "#A40082",
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
  userMessageText: StyleSheet.flatten([TextStyles.normal, { color: "white" }])
});
