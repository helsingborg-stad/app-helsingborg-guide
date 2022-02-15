// @flow
import React from "react";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Colors from "@assets/styles/Colors";
import {
  showBottomBar,
} from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";


const styles = {
  opacity: 0.6
};
function HeaderBackButton({ navigation, onPress, path, displayBottomBar }: { navigation: Object, onPress: any, displayBottomBar: Boolean }) {
 const dispatch = useDispatch();


  const updatePath = () => {
    let split = path.split("/")
    let newPath = split.slice(0, split.length - 1).join("/");
    trackScreen(newPath, newPath);
  }

  return (
    <Icon
      name={"chevron-left"}
      size={36}
      color={Colors.white}
      style={styles}
      onPress={() => {
        !!onPress && onPress();
        !!displayBottomBar && dispatch(showBottomBar(true));
        !!path && updatePath()
        navigation && navigation.goBack();

      }}
    />
  );
}

export default HeaderBackButton;
