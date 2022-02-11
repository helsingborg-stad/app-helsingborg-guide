import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Colors } from "@assets/styles";
import styles from "./style";

type Props = {
  label: string,
  Icon: any,
  selected: boolean,
  onPress(): void,
};

const selectedColor: string = Colors.white;
const inactiveColor: string = Colors.themeExtra2;

const BottomBarButton = ({ label, Icon, onPress, selected }: Props) => {
  const color = selected ? selectedColor : inactiveColor;

  return (
    <TouchableOpacity style={styles.touchableIcon} onPress={onPress}>
      <View style={styles.iconView}>
        <Icon color={color} />
      </View>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default BottomBarButton;
