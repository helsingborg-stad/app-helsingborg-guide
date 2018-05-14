// @flow

import React from "react";
import { Text } from "react-native";

import styles from "./styles";

type Props = {
  startDate?: ?string,
  endDate?: ?string
}

const DateView = (props: Props) => {
  const { startDate, endDate } = props;
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
};

DateView.defaultProps = {
  startDate: null,
  endDate: null,
};

export default DateView;
