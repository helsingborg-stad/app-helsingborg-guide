// @flow
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Colors from "@assets/styles/Colors";
import {
  showBottomBar,
  selectCurrentSharingLink
} from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

const styles = {
  opacity: 0.6
};

function HeaderBackButton({ navigation, onPress, path, displayBottomBar }: { navigation: Object, onPress: any, displayBottomBar: Boolean }) {
 const dispatch = useDispatch();
 const { currentSharingLink } = useSelector(s => s.uiState)

  const updatePathAndSharelink = () => {
    let pathSplit = path.split("/")
    let shareSplit = currentSharingLink.split("/");
    let newPath = pathSplit.slice(0, pathSplit.length - 1).join("/");
    let newSharingLink = shareSplit.slice(0, shareSplit.length - 1).join("/");
    dispatch(selectCurrentSharingLink(newSharingLink))
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
        !!path && updatePathAndSharelink()
        navigation && navigation.goBack();

      }}
    />
  );
}

export default HeaderBackButton;
