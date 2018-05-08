// @flow
import React from "react";
import {
  Text,
  View,
} from "react-native";
import { TextStyles } from "../../../styles";

// TODO make use of component children
type Props = {
  style?: any,
  text: string
};

const ExpandableText = (props: Props) =>
  (<View style={[props.style]}>
    <Text style={TextStyles.body}>{props.text}
    </Text>
  </View>);

ExpandableText.defaultProps = {
  style: null,
};

export default ExpandableText;
