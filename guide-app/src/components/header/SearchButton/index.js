// @flow
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import styles from "./styles";

const searchIcon = require("@assets/images/search-id.png");

type Props = {
  navigation: any
};

function onPress(navigation: any) {
  const { navigate } = navigation;
  navigate("SearchObjectScreen");
}

const SearchButton = (props: Props) => (
  <TouchableOpacity
    onPress={() => onPress(props.navigation)}
    style={styles.container}
  >
    <Image style={styles.image} source={searchIcon} />
  </TouchableOpacity>
);

export default SearchButton;
