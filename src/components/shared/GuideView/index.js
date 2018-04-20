// @flow

import React from "react";
import { Text, View } from "react-native";

declare type Props = {
  guide: Guide
}

const GuideView = (props: Props) =>
  (<View >
    <Text>{`guide id: ${props.guide.id}`}</Text>
  </View>);


export default GuideView;
