import * as _ from "lodash";
import RNFetchBlob from "react-native-fetch-blob";
import {
  Platform,
} from "react-native";

const Headers = ["http://", "https://", "ftp://"];
const MIME = ["jpeg", "jpg", "png", "mp3", "mp4", "m4a"];

const basePath = RNFetchBlob.fs.dirs.CacheDir;

function stripTrailingSlash(str) {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
}

const FetchService = {
  isString(data) {
    return typeof data === "string";
  },

  isObject(data) {
    if (!data) return false;
    return typeof data === "object";
  },

  isUrl(str) {
    if (!FetchService.isString(str)) return false;
    const index = _.findIndex(Headers, header => _.startsWith(_.toLower(str), header));
    return !(index === -1);
  },

  isDownloadableUrl(str) {
    if (!FetchService.isUrl(str)) return false;
    const index = _.findIndex(MIME, ext => _.endsWith(_.toLower(str), `.${ext}`));
    return !(index === -1);
  },

  clearCache(path) {
    return RNFetchBlob.fs.unlink(path);
  },

  clearSessionCache(sessionId) {
    return RNFetchBlob.session(sessionId).dispose();
  },

  readFile(path) {
    return RNFetchBlob.fs.readFile(path, "base64");
  },

  // ######################################
  // The Json scanner
  scanJsonTree(mObject) {
    let paths = [];
    const keys = Object.keys(mObject);

    if (!keys.length) return paths;

    keys.forEach((key) => {
      const item = mObject[key];
      if (FetchService.isDownloadableUrl(item)) {
        paths = paths.concat([item]);
      }

      if (FetchService.isObject(item)) paths = paths.concat(FetchService.scanJsonTree(item));
    });

    return _.uniq(paths);
  },

  fetch(url, id) {
    const config = {
      fileCache: true,
      path: `${basePath}/${id}/${url}`,
    };

    return RNFetchBlob.config(config).fetch("GET", url);
  },

  isExist(path, guideID) {
    let fullPath = FetchService.getFullPath(`${path}`);
    if (guideID) { fullPath = FetchService.getFullPath(`${guideID}/${path}`); }

    fullPath = stripTrailingSlash(fullPath);
    const exists = RNFetchBlob.fs.exists(Platform.OS === "android" ? `file://${fullPath}` : fullPath);
    return exists;
  },

  getFullPath(_path, guideID) {
    let path = _path;
    if (!path) path = "";
    if (guideID) { return `${basePath}/${guideID}/${path}`; }
    return `${basePath}/${path}`;
  },
};

export default FetchService;
