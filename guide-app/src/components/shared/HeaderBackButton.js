// @flow
import React from "react";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Colors from "@assets/styles/Colors";
import {
  showBottomBar,
} from "@actions/uiStateActions";

const styles = {
  opacity: 0.6
};
function HeaderBackButton({ navigation, onPress, displayBottomBar }: { navigation: Object, onPress: any, displayBottomBar: Boolean }) {
 const dispatch = useDispatch();

  return (
    <Icon
      name={"chevron-left"}
      size={36}
      color={Colors.white}
      style={styles}
      onPress={() => {
        !!onPress && onPress();
        !!displayBottomBar && dispatch(showBottomBar(true));
        navigation && navigation.goBack();
      }}
    />
  );
}

export default HeaderBackButton;
