// @flow
import { Platform } from "react-native";
import geolib from "geolib";
import { fromLatLngToPoint } from "mercator-projection";
import haversine from "haversine";

const ios = Platform.os === "ios";

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
  if (ios) {
    url = `http://maps.apple.com/?t=m&dirflg=d&daddr=${directionsCoordinate}&saddr=${userCoordinate}`;
  }

  return url;
}

function getLocationRelativePosition(userLocation: GeolocationType, latitude: number, longitude: number, initialBearing: number = 0) {
  const distance = haversine(userLocation.coords, { latitude, longitude }, { unit: "meter" }) || 0;
  let angle = (angleBetweenCoords(userLocation.coords, { latitude, longitude }) - initialBearing) * (Math.PI / 180);

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  if (!ios) {
    angle -= (Math.PI / 2);
    return {
      x: x * Math.cos(angle) - y * Math.sin(angle),
      y: x * Math.sin(angle) + y * Math.cos(angle),
    };
  }

  return { x, y };
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
};
