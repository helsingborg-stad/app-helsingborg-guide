// @flow

import React from "react";
import { Text } from "react-native";

import styles from "./styles";

function renderDate(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) { return null; }

  const start = new Date(startDate);
  const end = new Date(endDate);

  try {
    return (<Text style={styles.text} numberOfLines={1}>
      {`${start.toISOString().substring(0, 10)} - ${end.toISOString().substring(0, 10)}`}
    </Text>);
  } catch (error) {
    // failed to convert date to ISO string
  }
  return null;
}

type Props = {
  startDate?: string,
  endDate?: string
}

export default (props: Props) => renderDate(props.startDate, props.endDate);
