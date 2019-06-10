// @flow
import { Platform } from "react-native";
import geolib from "geolib";
import haversine from "haversine";
import { fromLatLngToPoint } from "mercator-projection";

const WALKING_SPEED = 80; // metres per minute
const ARRIVE_DISTANCE = 20;

function getDistanceBetweenCoordinates(firstLocation: PositionLongLat, secondLocation: PositionLongLat): number {
  if (firstLocation.latitude && firstLocation.longitude && secondLocation.latitude && secondLocation.longitude) {
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

function getLocationRelativePosition(userLocation: GeolocationType, latitude: number, longitude: number) {
  const result = {};
  const hotspotPoint = fromLatLngToPoint({
    lat: latitude,
    lng: longitude,
  });
  const currentPoint = fromLatLngToPoint({
    lat: userLocation.coords.latitude,
    lng: userLocation.coords.longitude,
  });

  result.x = hotspotPoint.x - currentPoint.x;
  result.y = hotspotPoint.y - currentPoint.y;

  return result;
}

function angleBetweenCoords(start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number }) {
  // location of first mapItem in Sofiero-Topp-10, for testing purpose
  const x = end.latitude - 56.083793; // start.latitude;
  const y = end.longitude - 12.6594562; // start.longitude;
  let angle;

  if (Math.atan2(y, x) >= 0) {
    angle = Math.atan2(y, x) * (180 / Math.PI);
  } else {
    angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
  }

  return angle;
}

function getTravelDistance(fromLocation, toLocation, unit = "meter") {
  return haversine(fromLocation, toLocation, { unit }) || 0;
}

function getTravelTime(distance) {
  return distance / WALKING_SPEED;
}

function hasArrivedAtDestination(userLocation: GeolocationType, destination: { latitude: number, longitude: number }) {
  return getTravelDistance(userLocation.coords, destination) < ARRIVE_DISTANCE;
}

// Location of second mapItem in Sofiero-Topp-10, for testing purpose
const mockLocation = {
  coords: {
    latitude: 56.083793,
    longitude: 12.6594562,
  },
};

export default {
  getDistanceBetweenCoordinates,
  getShortestDistance,
  directionsUrl,
  getLocationRelativePosition,
  angleBetweenCoords,
  mockLocation,
  getTravelDistance,
  getTravelTime,
  hasArrivedAtDestination,
};
