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

export default {
  getDistanceBetweenCoordinates,
};
