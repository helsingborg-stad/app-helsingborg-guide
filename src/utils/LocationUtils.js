import {
  Platform,
} from "react-native";
import geolib from "geolib";

function getDistanceBetweenCoordinates(firstLocation, secondLocation) {
  if (firstLocation.latitude && firstLocation.longitude &&
    secondLocation.latitude && secondLocation.longitude) {
    const distance = geolib.getDistanceSimple(
      { latitude: firstLocation.latitude, longitude: firstLocation.longitude },
      { latitude: secondLocation.latitude, longitude: secondLocation.longitude },
    );
    return distance;
  }
  return 0;
}

function getShortestDistance(sourceLocation, targetLocations) {
  const distances = [];
  targetLocations.forEach((location) => {
    const distance = getDistanceBetweenCoordinates(location, sourceLocation);
    distances.push(distance);
  });
  return Math.min(...distances);
}

function directionsUrl(latitude, longitude, userLocation) {
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
