// @flow
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import RoundedBtn from "../../shared/roundedBtn";
import LangService from "../../../services/langService";
import styles from "./styles";

const MAX_DIGITS: number = 3;
const DEFAULT_CHAR: string = "_";
const DEFAULT_ARR: string[] = [DEFAULT_CHAR, DEFAULT_CHAR, DEFAULT_CHAR];

function strToArray(str, max) {
  const arr = [];
  for (let i = 0; i < max; i += 1) {
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
  number: string,
  displayedNumber: string[],
  shakeValue: Animated.Value
};

export default class KeyPad extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      number: "",
      displayedNumber: DEFAULT_ARR,
      shakeValue: new Animated.Value(0),
    };
  }

  componentDidUpdate() {
    if (this.state.number.length === MAX_DIGITS) {
      this.clearNumber();
      this.search();
    }
  }

  shake = () => {
    Animated.sequence([
      Animated.spring(this.state.shakeValue, { toValue: 1, velocity: 30 }),
    ]).start();
  }

  onDigitPressed(digit: number) {
    if (this.state.number.length === MAX_DIGITS) return;

    const number = this.state.number + digit;
    this.setState({ number, displayedNumber: strToArray(number, 3) });
  }
  clearNumber() {
    this.setState({ number: "" });
  }

  clearAll = () => {
    this.setState({ number: "", displayedNumber: DEFAULT_ARR });
  }

  search = () => {
    this.props.onSearch(this.state.number);
  }

  displayDigits() {
    return this.state.displayedNumber.map((digit, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <View key={index} style={[styles.rowItem, styles.upperDigitContainer]}>
        <Text style={[styles.digitText, styles.darkText]}>{digit}</Text>
      </View>
    ));
  }

  render() {
    const noNumber = this.state.displayedNumber === "";

    const scale = this.state.shakeValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1],
    });
    const shakeAnimatedStyle = { transform: [{ scale }] };

    return (
      <Animated.View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.btnContainer}>
            <RoundedBtn
              style={styles.closeButton}
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
              <Text style={[styles.digitText, styles.darkText]}>#</Text>
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
              onPress={this.clearAll}
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
