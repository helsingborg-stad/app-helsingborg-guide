// @flow
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { Colors, TextStyles } from "@assets/styles";
import { showBottomBar } from "@actions/uiStateActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Share from "react-native-share";
import LangService from "../../services/langService";

type Props = {
  navigation: Object,
  route: Object,
};

const QuizResultScreen = (props: Props) => {
  const { navigation, route } = props;
  const {
    quiz: { finish },
  } = route.params;
  const dispatch = useDispatch();

  const [shareResult, setShareResult] = useState(null);

  const getErrorString = (error, defaultValue) => {
    let e = defaultValue || "Something went wrong. Please try again";
    if (typeof error === "string") {
      e = error;
    } else if (error && error.message) {
      e = error.message;
    } else if (error && error.props) {
      e = error.props;
    }
    return e;
  };

  const shareImage = async () => {
    const shareOptions = {
      title: finish?.shareTitle,
      url: finish?.shareImage?.url,
      failOnCancel: false,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      setShareResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      setShareResult("error: ".concat(getErrorString(error)));
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{finish?.header}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                dispatch(showBottomBar(true));
                navigation.goBack();
              }}
            >
              <Icon
                style={styles.buttonIcon}
                name={"close"}
                size={16}
                width={16}
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.imagesContainer}>
            <Image
              style={styles.finishedImage}
              source={{ uri: finish?.images[0]?.url }}
              resizeMode="contain"
            />
            <Image
              style={styles.finishedImage}
              source={{ uri: finish?.images[1]?.url }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyTitle}>{finish?.title}</Text>
            <Text style={styles.bodyText}>{finish?.body}</Text>
          </View>
          {finish?.shareImage?.url && (
            <TouchableOpacity
              style={styles.shareContainer}
              onPress={() => {
                shareImage().then(() => null);
              }}
            >
              <Text style={styles.shareText}>
                {finish?.shareTitle || LangService.strings.SHARE}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeSecondary,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingBottom: 60,
  },
  titleContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: "100%",
  },
  title: {
    ...TextStyles.title,
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    backgroundColor: "white",
    alignItems: "center",
    width: 36,
    height: 36,
    borderRadius: 36,
    right: 24,
  },
  shareContainer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 38,
    backgroundColor: "white",
    textAlignVertical: "center",
    borderRadius: 54,
    minHeight: 54,
  },
  shareButton: {
    backgroundColor: "white",
    width: 54,
    minHeight: 54,
    borderRadius: 54,
  },
  shareText: {
    textAlignVertical: "center",
    textAlign: "center",
    padding: 10,
    alignSelf: "center",
  },
  shareIcon: {
    lineHeight: 48,
  },
  buttonIcon: {
    lineHeight: 37,
  },
  imagesContainer: {
    width: "50%",
    alignSelf: "center",
  },
  finishedImage: {
    marginHorizontal: 11,
    marginBottom: 4,
    width: "100%",
    aspectRatio: 1,
  },
  bodyContainer: {
    flexGrow: 1,
    marginTop: 22,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  bodyTitle: {
    ...TextStyles.title,
    color: "white",
    textAlign: "center",
    fontSize: 26,
    marginHorizontal: 42,
  },
  bodyText: {
    marginTop: 8,
    color: "white",
    textAlign: "center",
    flexGrow: 1,
    fontSize: 16,
    lineHeight: 22,
    marginHorizontal: 42,
  },
});



export default QuizResultScreen;
