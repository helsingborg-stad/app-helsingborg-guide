// @flow
import {
  Platform,
} from "react-native";
import geolib from "geolib";

function getDistanceBetweenCoordinates(firstLocation: PositionLongLat, secondLocation: PositionLongLat): number {
  if (firstLocation.latitude && firstLocation.longitude &&
    secondLocation.latitude && secondLocation.longitude) {
    return geolib.getDistanceSimple(firstLocation, secondLocation);
  }
  return 0;
}

function getShortestDistance(sourceLocation: PositionLongLat, targetLocations: PositionLongLat[]): number {
  const distances = [];
  targetLocations.forEach((location) => {
    const distance = getDistanceBetweenCoordinates(location, sourceLocation);
    distances.push(distance);
  });
  return Math.min(...distances);
}

function directionsUrl(latitude: number, longitude: number, userLocation: GeolocationType): string {
  const directionsCoordinate = `${latitude},${longitude}`;

  let userCoordinate = "";
  if (userLocation) {
    userCoordinate = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
  }
  let url = `google.navigation:q=${directionsCoordinate}`;
  if (Platform.OS === "ios") {
    url = `http://maps.apple.com/?t=m&dirflg=d&daddr=${directionsCoordinate}&saddr=${userCoordinate}`;
  }

  return url;
}

export default {
  getDistanceBetweenCoordinates,
  getShortestDistance,
  directionsUrl,
};
