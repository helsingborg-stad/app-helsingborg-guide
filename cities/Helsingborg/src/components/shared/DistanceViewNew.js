// @flow

import React from "react";
import { Text } from "react-native";
import LangService from "@services/langService";
import LocationUtils from "@utils/LocationUtils";

type Props = {
  textStyle: Object,
  currentLocation: GeolocationType,
  location: Location,
  useFromHereText: boolean
};

export default function(props: Props) {
  if (!props.currentLocation) {
    return null;
  }

  const { coords } = props.currentLocation;
  const distance = LocationUtils.getDistanceBetweenCoordinates(
    coords,
    props.location
  );
  if (!distance) {
    return null;
  }

  const useKm = distance > 1000;
  const suffix = useKm ? "km" : "m";
  const renderedDistance = useKm ? Math.round(distance / 1000) : distance;
  const fromHereText = props.useFromHereText
    ? LangService.strings.FROM_HERE
    : "";
  return (
    <Text style={props.textStyle}>
      {renderedDistance} {suffix} {fromHereText}
    </Text>
  );
}
