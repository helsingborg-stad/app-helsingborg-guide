import React from "react";
import { Text } from "react-native";
import LangService from "../../services/langService";

type Props = {
  distance: any,
  style: any,
  useFromHereText: any
};

export default ({ distance, style, useFromHereText }: Props) => {
  const useKm = distance > 1000;
  const suffix = useKm ? "km" : "m";
  const renderedDistance = useKm ? Math.round(distance / 1000) : distance;
  const fromHereText = useFromHereText ? LangService.strings.FROM_HERE : "";
  return (
    <Text style={style}>
      {renderedDistance} {suffix} {fromHereText}
    </Text>
  );
};
