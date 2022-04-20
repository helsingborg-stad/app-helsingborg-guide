/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "@assets/styles";

const ICON_SIZE = 20;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 30,
    marginLeft: 'auto',
  },

  mainContainer: {
    marginTop: 40,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Colors.themeSecondary,
    padding: 10,
    borderRadius: 20,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  icon: {
  },
  titleContainer: {
    marginTop: 5,
    flex: 0,
    alignItems: "center",
  },
  title: {
    color: Colors.black,
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22.0,
    textAlign: "center",
  },
  disabledText: {
    color: Colors.gray8
  },
  disabledBkgd: {
    backgroundColor: Colors.offWhite1
  }
});

type Props = {
  disabled: any,
  onPress: any,
  name: any,
  size: any,
  color: any,
  text: any
};

export default class ButtonsBarItem extends Component<Props> {
  render() {
    const _styles = [styles.item];
    const _iconStyles = [styles.icon];
    const _textStyles = [styles.title];
    if (this.props.disabled) {
      _styles.push(styles.disabledBkgd);
      _iconStyles.push(styles.disabledText);
      _textStyles.push(styles.disabledText);
    }

    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={_styles}
        onPress={event => this.props.onPress(event)}
      >
        <View style={styles.mainContainer}>
          <View style={styles.iconContainer}>
            <Icon
              style={_iconStyles}
              name={this.props.name}
              size={this.props.size || ICON_SIZE}
              color={this.props.color}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={_textStyles}>{this.props.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
