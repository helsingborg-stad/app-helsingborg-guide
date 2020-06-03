// @flow
import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from "react-native";
import { Colors, TextStyles } from "@assets/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Share from "react-native-share";

type Props = {
  navigation: Object
};

type State = {
  shareResult: ?string
};

class QuizResultScreen extends Component<Props, State> {
  state = {
    shareResult: null
  };

  static navigationOptions = {
    header: null
  };

  getErrorString = (error, defaultValue) => {
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

  shareImage = async () => {
    const {
      quiz: { finishScreen }
    } = this.props.navigation.state.params;

    const shareOptions = {
      title: finishScreen.shareString,
      url: finishScreen.shareImage,
      failOnCancel: false
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      this.setState({
        shareResult: JSON.stringify(ShareResponse, null, 2)
      });
    } catch (error) {
      console.log("Error =>", error);
      this.setState({
        shareResult: "error: ".concat(this.getErrorString(error))
      });
    }
  };

  downloadImage = async () => { };

  render() {
    console.log(this.props);
    const {
      quiz: { finishScreen }
    } = this.props.navigation.state.params;

    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{finishScreen.title}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  style={styles.buttonIcon}
                  name={"close"}
                  size={16}
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>
            <ImageBackground
              style={styles.finishedImage}
              imageStyle={styles.botImageImage}
              source={finishScreen.firstImage}
              resizeMode="contain"
            />
            <ImageBackground
              style={styles.finishedImage}
              imageStyle={styles.botImageImage}
              source={finishScreen.secondImage}
              resizeMode="contain"
            />
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyTitle}>{finishScreen.body.title}</Text>
              <Text style={styles.bodyText}>{finishScreen.body.text}</Text>
            </View>
            <TouchableOpacity
              style={styles.shareContainer}
              onPress={() => {
                this.shareImage();
              }}
            >
              <Text style={styles.shareText}>{finishScreen.shareString}</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeSecondary
  },
  titleContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36
  },
  title: {
    ...TextStyles.title,
    color: "white",
    fontSize: 14,
    textAlign: "center"
  },
  button: {
    position: "absolute",
    backgroundColor: "white",
    width: 36,
    height: 36,
    borderRadius: 36,
    right: 24
  },
  shareContainer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 38,
    backgroundColor: "white",
    textAlignVertical: "center",
    borderRadius: 54,
    height: 54
  },
  shareButton: {
    backgroundColor: "white",
    width: 54,
    height: 54,
    borderRadius: 54
  },
  shareText: {
    textAlignVertical: "center"
  },
  shareIcon: {
    alignSelf: "center",
    lineHeight: 48
  },
  buttonIcon: {
    alignSelf: "center",
    lineHeight: 37
  },
  finishedImage: {
    alignSelf: "center",
    marginHorizontal: 11,
    marginBottom: 4,
    width: 220,
    aspectRatio: 1
  },
  botImageImage: {
    // borderRadius: 10
  },
  bodyContainer: {
    marginTop: 22,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  bodyTitle: {
    ...TextStyles.title,
    color: "white",
    textAlign: "center",
    fontSize: 26,
    marginHorizontal: 42
  },
  bodyText: {
    marginTop: 8,
    color: "white",
    textAlign: "center",
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    marginHorizontal: 42
  }
});

export default QuizResultScreen;
