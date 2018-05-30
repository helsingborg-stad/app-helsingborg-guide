import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from "react-native";
import NotificationService from "./notificationService";
import fetchService from "./FetchService";
import LangService from "./langService";

import { loadFromCache } from "../utils/DownloadMediaUtils";

let instance = null;
let MediaPlayer;
let EventEmitter;

const MEDIA_PREPARED = "MEDIA_PREPARED";
const MEDIA_COMPLETED = "MEDIA_COMPLETED";
const MEDIA_ERROR = "MEDIA_ERROR";
const MEDIA_NOTIFICATION_ID = 101;

const RELEASED_AUDIO_OBJ = {
  url: "",
  title: "",
  avatar_url: "",
  hasAudio: false,
  isPrepared: false,
  isPlaying: true,
  duration: 0,
  currentPosition: 0,
};

const config = () => {
  if (Platform.OS === "android") {
    MediaPlayer = NativeModules.MediaAndroid;
    EventEmitter = DeviceEventEmitter;
  } else if (Platform.OS === "ios") {
    MediaPlayer = NativeModules.AudioManager;
    EventEmitter = new NativeEventEmitter(MediaPlayer);
  }
};

config();

export default class MediaService {
  static url;
  audio;
  updateInterval;
  updatePaused;
  onAudioInitedCallback;
  onAudioLoadSuccessCallback;
  onAudioUpdateCallback;

  constructor() {
    this.audio = RELEASED_AUDIO_OBJ;
    this.onPreparedCallback = this.onPreparedCallback.bind(this);
    this.onCompletedCallback = this.onCompletedCallback.bind(this);
  }

  static getInstance() {
    if (!instance) instance = new MediaService();
    return instance;
  }

  tryLoadFromCache = async (guideId, uri) => {
    if (!guideId || !uri) throw new Error("Null params passed");

    try {
      const data = await loadFromCache(`${guideId}`, uri);
      this.setState({ imageSource: { uri: `data:image/png;base64,${data}` } });
    } catch (err) {
      // do not care
      this.setState({ imageSource: { uri } });
    }
  }

  init(audio, guideID) {
    if (!audio || !audio.url) return Promise.reject(new Error("No url provided"));


    // TODO: plug in new way of loading offline.
    // this.tryLoadFromCache(guideID, audio.url);


    fetchService
      .isExist(audio.url, guideID)
      .then((exist) => {
        const fullPath = fetchService.getFullPath(audio.url, guideID);
        if (exist) return Promise.resolve(`file://${fullPath}`);
        return Promise.resolve(audio.url);
      })
      .then((uri) => {
        console.log("Audio URI: ", uri);
        MediaService.url = uri;
        NotificationService.showMediaNotification(LangService.strings.PLAYING, audio.title, MEDIA_NOTIFICATION_ID);
        this.onError(MediaService.onErrorHandler);
        this.audio = Object.assign({}, RELEASED_AUDIO_OBJ, audio);
        this.onCompleted(this.onCompletedCallback);

        this.onAudioInited(this.audio);
        this.onPrepared(this.onPreparedCallback);
        this.resumeUpdatingState();

        if (Platform.OS === "ios") return MediaPlayer.init(MediaService.url, audio.title, audio.description_plain);
        return MediaPlayer.init(MediaService.url);
      });
    return null;
  }

  start() {
    MediaPlayer.start();
    this.resumeUpdatingState();
  }

  pause() {
    this.pauseUpdatingState();
    MediaPlayer.pause();
  }

  stop() {
    this.pauseUpdatingState();
    MediaPlayer.stop();
  }

  release() {
    this.clearUpdateInterval();

    if (Platform.OS === "ios") {
      MediaPlayer.release1();
    } else {
      MediaPlayer.release();
    }

    MediaService.url = null;
    this.audio = null;

    NotificationService.closeNotification(MEDIA_NOTIFICATION_ID);
    this.unSubscribeOnError(MediaService.onErrorHandler);
    this.unSubscribeOnPrepared(this.onPreparedCallback);
    this.unSubscribeOnCompleted(this.onCompletedCallback);
  }

  getMeta() {
    if (!this.audio.hasAudio) return Promise.reject(new Error("Audio object is null"));

    const meta = {};
    return this.isPlaying()
      .then((isPlaying) => {
        meta.isPlaying = isPlaying;
        return this.getDuration();
      })
      .then((duration) => {
        meta.duration = duration;
        return this.getCurrentPosition();
      })
      .then((position) => {
        meta.currentPosition = position;
        return Promise.resolve(meta);
      });
  }

  getDuration() {
    return MediaPlayer.getDuration();
  }

  getCurrentPosition() {
    return MediaPlayer.getCurrentPosition();
  }

  isPlaying() {
    return MediaPlayer.isPlaying();
  }

  seekTo(position) {
    MediaPlayer.seekTo(position);
  }

  onPrepared(callback) {
    EventEmitter.addListener(MEDIA_PREPARED, callback);
  }

  onPreparedCallback() {
    this.onAudioPrepared();
    this.audio.isPrepared = true;

    if (this.updateInterval) return;
    this.updateInterval = setInterval(() => {
      if (!this.updatePaused) this.updateAudioState();
    }, 700);
  }

  pauseUpdatingState() {
    if (!this.updatePaused) this.updatePaused = true;
  }
  resumeUpdatingState() {
    if (this.updatePaused) this.updatePaused = false;
  }

  updateAudioState() {
    this.getMeta().then((meta) => {
      if (!this.updatePaused) {
        this.audio.currentPosition = meta.currentPosition;
        this.audio.duration = meta.duration;
        this.audio.isPlaying = meta.isPlaying;
        this.onUpdateAudioState(this.audio);
      }
    });
  }

  clearUpdateInterval() {
    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  unSubscribeOnPrepared(callback) {
    EventEmitter.removeListener(MEDIA_PREPARED, callback);
  }

  onError(callback) {
    EventEmitter.addListener(MEDIA_ERROR, callback);
  }
  unSubscribeOnError(callback) {
    EventEmitter.removeListener(MEDIA_ERROR, callback);
  }

  onCompleted(callback) {
    EventEmitter.addListener(MEDIA_COMPLETED, callback);
  }
  onCompletedCallback() {
    this.release();
  }
  unSubscribeOnCompleted(callback) {
    EventEmitter.removeListener(MEDIA_COMPLETED, callback);
  }

  onAudioInited = (audio) => {
    this.onAudioInitedCallback(audio);
  };

  onAudioPrepared = () => {
    this.onAudioLoadSuccessCallback();
  };

  onUpdateAudioState = (audio) => {
    this.onAudioUpdateCallback(audio);
  };

  loadAudioFile = (audioState, hasAudio, guideID, onAudioInited, onAudioLoadSuccess, onAudioUpdate) => {
    this.onAudioInitedCallback = onAudioInited;
    this.onAudioLoadSuccessCallback = onAudioLoadSuccess;
    this.onAudioUpdateCallback = onAudioUpdate;

    if (hasAudio) this.mediaService.release();
    const audioName = audioState.title;
    console.log(`load ${audioName}`);

    const audioObject = {
      url: audioState.url,
      title: audioState.title,
      avatar_url: audioState.avatar_url,
      hasAudio: true,
      isPlaying: true,
    };
    this.init(audioObject, guideID);
  };
}
