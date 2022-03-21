import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { HeaderStyles } from "@assets/styles";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import styles from "./style";

const NotFound = () => {

  return (

    <View style={styles.container}>

    </View>
  )
}

NotFound["navigationOptions"] = ({ navigation }) => {
  const { title, path } = navigation.state.params;
  return {
    ...HeaderStyles.noElevation,
    title,
    headerRight: () => <View />,
    headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />,
  };
};

export default NotFound;
