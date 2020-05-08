// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { SafeAreaView, StyleSheet, StatusBar, Text, View } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles, TextStyles } from "@assets/styles";

type Props = {
  navigation: Object
};

type State = {};

class QuizResultScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: <View />,
      headerLeft: <HeaderBackButton navigation={navigation} />
    };
  };

  state = {};

  componentWillUnmount() {
    // const { navigation } = this.props;
    // if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
    //   this.props.dispatchShowBottomBar(true);
    // }
  }

  render() {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <SafeAreaView style={styles.container}>
          <Text style={TextStyles.title}>Grattis</Text>
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
)(QuizResultScreen);
