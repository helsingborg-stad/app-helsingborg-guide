// @flow
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import RoundedBtn from "../../shared/roundedBtn";
import LangService from "../../../services/langService";
import styles from "./styles";

const MAX_DIGITS = 3;
const DEFAULT_CHAR = "_";
const DEFAULT_ARR = [DEFAULT_CHAR, DEFAULT_CHAR, DEFAULT_CHAR];

function strToArray(str, max) {
  const arr = [];
  for (let i = 0; i < max; i++) {
    if (i >= str.length) arr.push(DEFAULT_CHAR);
    else arr.push(str[i]);
  }
  return arr;
}

type Props = {
  onPressClose(): void,
  onSearch(id: string): void,
};

type State = {
};

export default class KeyPad extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      number: "",
      displayedNumber: DEFAULT_ARR,
      animValue: new Animated.Value(0),
      shakeValue: new Animated.Value(0),
    };
    this.resultCode = props.resultCode;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.resultCode !== this.resultCode) {
      this.clearAll();
      this.resultCode = nextProps.resultCode;

      if (nextProps.resultCode === 404) {
        this.shake();
      }
    }
  }

  componentDidUpdate() {
    if (this.state.number.length === MAX_DIGITS) {
      this.clearNumber();
      this.search();
    }
  }

  shake() {
    Animated.sequence([
      Animated.spring(this.state.shakeValue, { toValue: 1, velocity: 30 }),
    ]).start();
  }

  onDigitPressed(digit) {
    if (this.state.number.length === MAX_DIGITS) return;
    const number = this.state.number + digit;
    this.setState({ number, displayedNumber: strToArray(number, 3) });
  }
  clearNumber() {
    this.setState({ number: "" });
  }

  clearAll() {
    this.setState({ number: "", displayedNumber: DEFAULT_ARR });
  }

  search = () => {
    this.resultCode = 10;
    this.props.onSearch(this.state.number);
  }

  displayDigits() {
    return this.state.displayedNumber.map((digit, index) => (
      <View key={index} style={[styles.rowItem, styles.upperDigitContainer]}>
        <Text style={[styles.digitText, { color: "black" }]}>{digit}</Text>
      </View>
    ));
  }

  render() {
    const noNumber = this.state.displayedNumber === "";

    /*
    const translateY = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [FULL_HEIGHT, 0],
    });
    const animatedStyle = { transform: [{ translateY }] };
   */

    const scale = this.state.shakeValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1],
    });
    const shakeAnimatedStyle = { transform: [{ scale }] };

    return (
      <Animated.View style={[styles.wrapper]}>
        <View style={styles.headerContainer}>
          <View style={styles.btnContainer}>
            <RoundedBtn
              style={{ backgroundColor: "#7B075E" }}
              active={<Icon name="times" size={20} color="white" />}
              idle={<Icon name="times" size={20} color="white" />}
              onPress={this.props.onPressClose}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{LangService.strings.SEARCH_BY_NUMBER}</Text>
          </View>
        </View>
        <View style={styles.padContainer}>
          <Animated.View style={[styles.rowContainer, shakeAnimatedStyle]}>
            <View style={[styles.rowItem, styles.upperDigitContainer]}>
              <Text style={[styles.digitText, { color: "black" }]}>#</Text>
            </View>
            {this.displayDigits()}
          </Animated.View>
          <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => this.onDigitPressed(1)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDigitPressed(2)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDigitPressed(3)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => this.onDigitPressed(4)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDigitPressed(5)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDigitPressed(6)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => this.onDigitPressed(7)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDigitPressed(8)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onDigitPressed(9)} style={[styles.rowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => this.onDigitPressed(0)} style={[styles.doubleRowItem, styles.digitContainer]}>
              <Text style={styles.digitText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.clearAll.bind(this)}
              style={[styles.rowItem, styles.digitContainer, noNumber ? styles.disabled : null]}
            >
              <Text style={[styles.digitText, noNumber ? styles.disabledText : null]}>x</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
}
