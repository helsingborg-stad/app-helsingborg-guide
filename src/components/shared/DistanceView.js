import React from "react";
import { Text } from "react-native";

export default ({ distance, style }) => {
  const useKm = distance > 1000;
  const suffix = useKm ? "km" : "m";
  const renderedDistance = useKm ? Math.round(distance / 1000) : distance;
  return (
    <Text style={style}>{renderedDistance} {suffix}</Text>
  );
};

