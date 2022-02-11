/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "@assets/styles";

type Props = {
  idle: any,
  active: any,
  isActive: any,
  style: any,
  disabled: any,
  outline: any,
  label: any,
  onPress: any
};

type State = {
  animValue: Animated.Value
};

const viewStyle = { flex: 1 };

export default class RoundedBtn extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(1)
    };
    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
  }
  componentDidMount() {}

  displayBtn() {
    const close = this.props.idle || (
      <Icon name="info" size={20} color={Colors.white} />
    );
    const open = this.props.active || (
      <Icon name="times" size={20} color={Colors.white} />
    );
    const icon = this.props.isActive ? open : close;
    const _styles = [styles.closeBtn, this.props.style];
    if (this.props.disabled) {
      _styles.push(styles.disabled);
    }
    if (this.props.outline) {
      _styles.push(styles.outline);
    }

    const animatedStyle = {
      transform: [{ scale: this.state.animValue }]
    };

    return (
      <Animated.View style={[viewStyle, animatedStyle]}>
        <TouchableWithoutFeedback
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
          onPress={() => this.toggle()}
        >
          <View style={styles.mainContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>{this.props.label}</Text>
            </View>
            <View style={[styles.btnContainer]}>
              <View disabled={this.props.disabled || false} style={[_styles]}>
                {icon}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  toggle() {
    this.props.onPress();
  }

  onPressIn() {
    Animated.spring(this.state.animValue, { toValue: 1.4, useNativeDriver: true}).start();
  }
  onPressOut() {
    Animated.spring(this.state.animValue, { toValue: 1, useNativeDriver: true }).start();
  }

  render() {
    return this.displayBtn();
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minWidth: 200,
    // backgroundColor:'red',
    flexDirection: "row"
  },

  btnContainer: {
    flex: 1
  },

  closeBtn: {
    backgroundColor: Colors.gray5,
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  bigger: {
    width: 45,
    height: 45,
    backgroundColor: Colors.themeExtra3
  },
  disabled: { backgroundColor: Colors.offWhite2 },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: Colors.white
  },
  labelContainer: {
    flex: 3,
    // backgroundColor:'orange',
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 10
  },
  labelText: {
    color: Colors.themeControl,
    fontSize: 16
  }
});
