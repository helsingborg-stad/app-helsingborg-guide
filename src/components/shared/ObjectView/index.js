// @flow

import React from "react";
import { View } from "react-native";
import styles from "./style";

type Props = {
  contentObject: ContentObject
}

const ObjectView = (props: Props) => (
  <View style={styles.viewContainer} />);

ObjectView.defaultProps = {
};

export default ObjectView;
