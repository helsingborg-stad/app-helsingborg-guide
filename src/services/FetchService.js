/**
 * Created by msaeed on 2017-04-10.
 */

import * as _ from "lodash";
import RNFetchBlob from "react-native-fetch-blob";
import {
  PermissionsAndroid,
  Platform,
} from "react-native";

let instance = null;
const Headers = ["http://", "https://", "ftp://"];
const MIME = ["jpeg", "jpg", "png", "mp3", "mp4", "m4a"];

export default class FetchService {
  basePath;

  constructor() {
    this.basePath = RNFetchBlob.fs.dirs.CacheDir;
  }

  static getInstance() {
    if (!instance) instance = new FetchService();
    return instance;
  }

  static isString(data) {
    return typeof data === "string";
  }

  static isObject(data) {
    if (!data) return false;
    return typeof data === "object";
  }

  static isUrl(str) {
    if (!FetchService.isString(str)) return false;
    const index = _.findIndex(Headers, header => _.startsWith(_.toLower(str), header));
    return !(index === -1);
  }

  static isDownloadableUrl(str) {
    if (!FetchService.isUrl(str)) return false;
    const index = _.findIndex(MIME, ext => _.endsWith(_.toLower(str), `.${ext}`));
    return !(index === -1);
  }

  static clearCache(path) {
    return RNFetchBlob.fs.unlink(path);
  }

  static clearSessionCache(sessionId) {
    return RNFetchBlob.session(sessionId).dispose();
  }

  static readFile(path) {
    return RNFetchBlob.fs.readFile(path, "base64");
  }

  static getExt(url) {
    const l = url.length;
    if (!l) return "";
    // what to do
    return url[l - 3] + url[l - 2] + url[l - 1];
  }

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

      if (FetchService.isObject(item)) paths = paths.concat(this.scanJsonTree(item));
    });

    return _.uniq(paths);
  }

  // ########################################
  fetch(url) {
    const config = {
      fileCache: true,
      path: `${this.basePath}/${url}`,
    };

    const task = RNFetchBlob.config(config).fetch("GET", url);
    console.log(url);
    return task;
    // ignore the permission  (cache store).
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((granted) => {
      if (granted) return task.fetch("GET", url);

      console.log("permission Write to storage is not granted");
      return Promise.reject();
    });
  }

  isExist(path) {
    const fullPath = this.getFullPath(path);
    return RNFetchBlob.fs.exists(Platform.OS === "android" ? `file://${fullPath}` : fullPath);
  }

  getFullPath(_path) {
    let path = _path;
    if (!path) path = "";
    return `${this.basePath}/${path}`;
  }
}
