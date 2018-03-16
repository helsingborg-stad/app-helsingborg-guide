import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Colors,
} from "../../styles/";

const ICON_SIZE = 20;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 46,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.listBackgroundColor,
  },
  mainContainer: {
    maxWidth: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: { flex: 0, alignItems: "center" },
  icon: {},
  titleContainer: { flex: 0, alignItems: "center", paddingLeft: 8 },
  title: {
    color: "purple",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22.0,
  },
  disabledText: {
    color: "#cecece",
  },
  disabledBkgd: {
    backgroundColor: "#f2f2f2",
  },
});


function ButtonsBarItem(props) {
  const _styles = [styles.item];
  const _iconStyles = [styles.icon];
  const _textStyles = [styles.title];

  if (props.disabled) {
    _styles.push(styles.disabledBkgd);
    _iconStyles.push(styles.disabledText);
    _textStyles.push(styles.disabledText);
  }

  return (
    <TouchableOpacity disabled={props.disabled} style={_styles} onPress={event => props.onPress(event)}>
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <Icon style={_iconStyles} name={props.name} size={props.size || ICON_SIZE} color={props.color} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={_textStyles}>{props.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

ButtonsBarItem.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};


export default ButtonsBarItem;
