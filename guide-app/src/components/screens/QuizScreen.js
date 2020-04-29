// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StatusBar, SafeAreaView } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import { Colors, HeaderStyles } from "@assets/styles";
import QuizView from "@shared-components/QuizView";

type Props = {
  navigation: Object
};

class QuizScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: <View />,
      headerLeft: <HeaderBackButton navigation={navigation} />
    };
  };

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
        <SafeAreaView style={{ flex: 1 }}>
          <QuizView />
        </SafeAreaView>
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
