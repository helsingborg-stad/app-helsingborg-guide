// @flow
import { Platform } from "react-native";
import { getDistance } from "geolib";
import haversine from "haversine";

const ios = Platform.OS === "ios";

const WALKING_SPEED = 80; // metres per minute
const ARRIVE_DISTANCE = 20;

function getDistanceBetweenCoordinates(
  firstLocation: PositionLongLat,
  secondLocation: PositionLongLat
): number {
  if (
    firstLocation?.latitude &&
    firstLocation?.longitude &&
    secondLocation?.latitude &&
    secondLocation?.longitude
  ) {
    return getDistance(firstLocation, secondLocation);
  }
  return 0;
}

function getShortestDistance(
  sourceLocation: PositionLongLat,
  targetLocations: PositionLongLat[]
): number {
  const distances = [];
  targetLocations.forEach(location => {
    const distance = getDistanceBetweenCoordinates(location, sourceLocation);
    distances.push(distance);
  });
  return Math.min(...distances);
}

function directionsUrl(
  latitude: number,
  longitude: number,
  userLocation: GeolocationType
): string {
  const directionsCoordinate = `${latitude},${longitude}`;

  let userCoordinate = "";
  if (userLocation) {
    userCoordinate = `${userLocation.coords.latitude},${
      userLocation.coords.longitude
    }`;
  }
  let url = `google.navigation:q=${directionsCoordinate}`;
  if (ios) {
    url = `http://maps.apple.com/?t=m&dirflg=d&daddr=${directionsCoordinate}&saddr=${userCoordinate}`;
  }

  return url;
}

function angleBetweenCoords(
  start: { latitude: number, longitude: number },
  end: { latitude: number, longitude: number }
) {
  const x = end.latitude - start.latitude;
  const y = end.longitude - start.longitude;
  const angle = Math.atan2(y, x);
  return angle >= 0 ? angle : angle + 2 * Math.PI;
}

function getLocationRelativePosition(
  userLocation: GeolocationType,
  targetLocation: Object,
  bearing: number = 0
) {
  const distance =
    haversine(userLocation.coords, targetLocation, { unit: "meter" }) || 0;
  const bearingOffset = ios ? 0 : bearing;
  const angle =
    angleBetweenCoords(userLocation.coords, targetLocation) -
    bearingOffset -
    Math.PI / 2;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  };
}

function getTravelDistance(
  fromLocation: { latitude: number, longitude: number },
  toLocation: { latitude: number, longitude: number },
  unit: string = "meter"
) {
  return haversine(fromLocation, toLocation, { unit }) || 0;
}

function getTravelTime(distance: number) {
  return distance / WALKING_SPEED;
}

function hasArrivedAtDestination(
  userLocation: GeolocationType,
  destination: { latitude: number, longitude: number }
) {
  return getTravelDistance(userLocation.coords, destination) < ARRIVE_DISTANCE;
}

export default {
  getDistanceBetweenCoordinates,
  getShortestDistance,
  directionsUrl,
  getLocationRelativePosition,
  getTravelDistance,
  getTravelTime,
  hasArrivedAtDestination
};
