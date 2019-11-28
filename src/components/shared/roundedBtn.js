/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type Props = {
  idle: any,
  active: any,
  isActive: any,
  style: any,
  disabled: any,
  outline: any,
  onPress: any
};

export default class RoundedBtn extends Component<Props> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  displayBtn() {
    const close = this.props.idle || (
      <Icon name="info" size={20} color="white" />
    );
    const open = this.props.active || (
      <Icon name="times" size={20} color="white" />
    );
    const icon = this.props.isActive ? open : close;
    const _styles = [styles.closeBtn, this.props.style];
    if (this.props.disabled) {
      _styles.push(styles.disabled);
    }
    if (this.props.outline) {
      _styles.push(styles.outline);
    }
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={this.props.disabled || false}
        style={_styles}
        onPress={() => this.toggle()}
      >
        {icon}
      </TouchableOpacity>
    );
  }

  toggle() {
    this.props.onPress();
  }

  render() {
    return this.displayBtn();
  }
}

const styles = StyleSheet.create({
  closeBtn: {
    backgroundColor: "#b4b4b4",
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  disabled: { backgroundColor: "#f6f6f6" },
  outline: {
    backgroundColor: "rgba(0,0,0,0)",
    borderWidth: 2,
    borderColor: "white"
  }
});
