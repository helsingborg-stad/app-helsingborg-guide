import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import Swiper from "react-native-swiper";
import { NavigationActions } from "react-navigation";
import { PropTypes } from "prop-types";
import ViewContainer from "../shared/view_container";
import FirstInstructionSlide from "../shared/FirstInstructionSlide";
import NormalInstructionSlide from "../shared/NormalInstructionSlide";
import { IS_WELCOMED } from "../../lib/my_consts";
import LangService from "../../services/langService";
import ColoredBar from "../shared/ColoredBar";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";

const IMAGE1 = require("../../images/firstInstructionImage.png");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  swiper: {
    backgroundColor: Colors.darkPurple,
  },
  dot: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    height: 9,
    marginVertical: 6,
    marginHorizontal: 10,
    width: 9,
  },
  activeDot: {
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    borderRadius: 7,
    borderWidth: 3,
    borderColor: Colors.white,
    height: 14,
    marginVertical: 7,
    marginHorizontal: 10,
    width: 14,
  },
  pagination: {
    top: 300,
  },
  btnContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.white,
    bottom: 80,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
    justifyContent: "center",
    position: "absolute",
  },
  btnText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      color: Colors.darkPurple,
      fontWeight: "500",
      fontSize: 15,
      lineHeight: 23,
      textAlign: "center",
      textAlignVertical: "center",
      includeFontPadding: false,
    }],
  ),
  colorBar: {
    left: 0,
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 20,
  },
});

export default class WelcomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    header: null,
  }

  static displayColorBar() {
    return (
      <View style={styles.colorBar}>
        <ColoredBar visible />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      total: 0,
    };
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.index === 0 ||
      nextState.index === 1 ||
      nextState.index === nextState.total - 1 ||
      nextState.index === nextState.total - 2
    ) {
      return true;
    }

    return false;
  }

  onMomentumScrollEnd(e, state, context) {
    this.setState({ index: context.state.index, total: context.state.total });
  }

  displaySlides() {
    const instructions = LangService.instructions.steps;
    return instructions.map((item, index) => {
      const btnText = index === instructions.length - 1 ? LangService.strings.LETS_GO : LangService.strings.JUMP_OVER;
      if (index === 0) {
        return (
          <FirstInstructionSlide
            key={index} // eslint-disable-line react/no-array-index-key
            content={item.content}
            closeBtnText={btnText}
            backgroundImageSource={IMAGE1}
          />
        );
      }

      return (
        <NormalInstructionSlide
          key={index} // eslint-disable-line react/no-array-index-key
          content={item.content}
          thumbnailSource={item.thumbnail}
          closeBtnText={btnText}
          onBtnPress={() => this.skipPress()}
          backgroundImageSource={item.background}
        />
      );
    });
  }

  skipPress() {
    AsyncStorage.setItem(IS_WELCOMED, JSON.stringify(true));
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "MainScreen" })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  displaySkipBtn() {
    if (this.state.index === 0) return <View />;

    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => this.skipPress()}>
          <Text style={styles.btnText}>
            {this.state.index === this.state.total - 1 ? LangService.strings.LETS_GO : LangService.strings.JUMP_OVER}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const dot = <View style={styles.dot} />;
    const activeDot = <View style={styles.activeDot} />;

    return (
      <ViewContainer style={[styles.wrapper]}>
        <Swiper
          style={styles.swiper}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          loop={false}
          dot={dot}
          paginationStyle={styles.pagination}
          activeDot={activeDot}
          showsButtons={false}
        >
          {this.displaySlides()}
        </Swiper>
        {this.displaySkipBtn()}
        {WelcomeScreen.displayColorBar()}
      </ViewContainer>
    );
  }
}
