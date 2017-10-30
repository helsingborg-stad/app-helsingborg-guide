/**
 * Created by msaeed on 2017-02-07.
 */
module.exports = () => {
  /** ***************************************************************************
     * geometry Encode / decode points
     * http://jsfiddle.net/8nzg7tta/
     **************************************************************************** */
  // decode function
  function decodePath(encoded, precision) {
    precision = precision || 5;
    precision = Math.pow(10, -precision);
    let len = encoded.length,
      index = 0,
      lat = 0,
      lng = 0,
      array = [];
    while (index < len) {
      var b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      array.push({ latitude: lat * precision, longitude: lng * precision });
    }
    return array;
  }

  // encode functions
  function encodePath(points) {
    let plat = 0;
    let plng = 0;
    let encoded_points = "";

    for (let i = 0; i < points.length; ++i) {
      encoded_points += encodePoint(plat, plng, points[i].lat, points[i].lng);
      plat = points[i].lat;
      plng = points[i].lng;
    }

    return encoded_points;
  }

  function encodePoint(plat, plng, lat, lng) {
    const late5 = Math.round(lat * 1e5);
    const plate5 = Math.round(plat * 1e5);

    const lnge5 = Math.round(lng * 1e5);
    const plnge5 = Math.round(plng * 1e5);

    dlng = lnge5 - plnge5;
    dlat = late5 - plate5;

    return encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
  }

  function encodeSignedNumber(num) {
    let sgn_num = num << 1;

    if (num < 0) {
      sgn_num = ~sgn_num;
    }

    return encodeNumber(sgn_num);
  }

  function encodeNumber(num) {
    let encodeString = "";

    while (num >= 0x20) {
      encodeString += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
      num >>= 5;
    }

    encodeString += String.fromCharCode(num + 63);
    return encodeString;
  }

  return {
    encodePath,
    decodePath,
  };
};
