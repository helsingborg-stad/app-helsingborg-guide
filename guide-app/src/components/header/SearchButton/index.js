// @flow
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import styles from "./styles";

const searchIcon = require("@assets/images/search-id.png");

type Props = {
  navigation: any,
  path: any,
};

function onPress(navigation: any, path: any) {
  const { navigate } = navigation;
  navigate("SearchObjectScreen", {
    path: path
  });
}

const SearchButton = (props: Props) => (
  <TouchableOpacity
    onPress={() => onPress(props.navigation, props.path)}
    style={styles.container}
  >
    <Image style={styles.image} source={searchIcon} />
  </TouchableOpacity>
);

export default SearchButton;
