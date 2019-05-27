// @flow
import { Platform } from "react-native";
import geolib from "geolib";
import { fromLatLngToPoint } from "mercator-projection";

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
    // lat: userLocation.coords.latitude,
    // lng: userLocation.coords.longitude,
    lat: 56.083793, // location of first mapItem in Sofiero-Topp-10
    lng: 12.6594562,
  });

  result.x = hotspotPoint.x - currentPoint.x;
  result.y = hotspotPoint.y - currentPoint.y;

  return result;
}

function angleBetweenCoords(start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number }) {
  const x = end.latitude - start.latitude;
  const y = end.longitude - start.longitude;
  let angle;

  if (Math.atan2(y, x) >= 0) {
    angle = Math.atan2(y, x) * (180 / Math.PI);
  } else {
    angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
  }

  return angle;
}

export default {
  getDistanceBetweenCoordinates,
  getShortestDistance,
  directionsUrl,
  getLocationRelativePosition,
  angleBetweenCoords,
};
