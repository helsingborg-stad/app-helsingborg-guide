// @flow
import React from "react";
import Icon from "react-native-vector-icons/Entypo";
import Colors from "@assets/styles/Colors";

const styles = {
  opacity: 0.6
};
function HeaderBackButton({ navigation, onPress }: { navigation: Object, onPress: any }) {
  return (
    <Icon
      name={"chevron-left"}
      size={36}
      color={Colors.white}
      style={styles}
      onPress={() => {
        navigation && navigation.goBack();
      }}
    />
  );
}

export default HeaderBackButton;
