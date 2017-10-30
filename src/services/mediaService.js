import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from "react-native";
import { NotificationService } from "./notificationService";
import store from "../store/configureStore";
import { errorHappened } from "../actions/errorActions";
import { FetchService } from "./FetchService";
import { LangService } from "./langService";
import { togglePlay, releaseAudioFile, loadAudioFile, loadAudioFileSuccess, updateAudio } from "../actions/audioActions";

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

config = () => {
  if (Platform.OS == "android") {
    MediaPlayer = NativeModules.MediaAndroid;
    EventEmitter = DeviceEventEmitter;
  } else if (Platform.OS == "ios") {
    MediaPlayer = NativeModules.AudioManager;
    EventEmitter = new NativeEventEmitter(MediaPlayer);
  }
};

config();

export class MediaService {
  static url;
  notificationService;
  fetchService;
  audio;
  updateInterval;
  updatePaused;

  constructor() {
    this.audio = RELEASED_AUDIO_OBJ;
    this.notificationService = NotificationService.getInstance();
    this.fetchService = FetchService.getInstance();
    this.onErrorHandler = this.onErrorHandler.bind(this);
    this.onPreparedCallback = this.onPreparedCallback.bind(this);
    this.onCompletedCallback = this.onCompletedCallback.bind(this);
  }
  static getInstance() {
    if (!instance) instance = new MediaService();
    return instance;
  }

  setUri(fullPath) {}

  init(audio) {
    if (!audio || !audio.url) return Promise.reject("No url provided");

    this.fetchService
      .isExist(audio.url)
      .then((exist) => {
        const fullPath = this.fetchService.getFullPath(audio.url);
        if (exist) return Promise.resolve(`file://${fullPath}`);
        return Promise.resolve(audio.url);
      })
      .then((uri) => {
        console.log("Audio URI: ", uri);
        MediaService.url = uri;
        this.notificationService.showMediaNotification(LangService.strings.PLAYING, audio.title, MEDIA_NOTIFICATION_ID);
        this.onError(this.onErrorHandler);
        this.audio = Object.assign({}, RELEASED_AUDIO_OBJ, audio);
        this.onCompleted(this.onCompletedCallback);

        store.dispatch(loadAudioFile(this.audio));
        this.onPrepared(this.onPreparedCallback);

        if (Platform.OS === "ios") return MediaPlayer.init(MediaService.url, audio.title, audio.description_plain);
        return MediaPlayer.init(MediaService.url);
      });
  }

  onErrorHandler() {
    store.dispatch(errorHappened("error: reading audio file"));
  }

  start() {
    MediaPlayer.start();
    store.dispatch(togglePlay(true));
    this.resumeUpdatingState();
  }

  pause() {
    this.pauseUpdatingState();
    MediaPlayer.pause();
    store.dispatch(togglePlay(false));
  }

  stop() {
    this.pauseUpdatingState();
    MediaPlayer.stop();
    store.dispatch(togglePlay(false));
  }

  release() {
    this.clearUpdateInterval();
    Platform.OS == "ios" ? MediaPlayer.release1() : MediaPlayer.release();
    MediaService.url = null;
    this.audio = null;
    store.dispatch(releaseAudioFile());
    this.notificationService.closeNotification(MEDIA_NOTIFICATION_ID);
    this.unSubscribeOnError(this.onErrorHandler);
    this.unSubscribeOnPrepared(this.onPreparedCallback);
    this.unSubscribeOnCompleted(this.onCompletedCallback);
  }

  getMeta() {
    if (!this.audio.hasAudio) return Promise.reject("Audio object is null");

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
    store.dispatch(loadAudioFileSuccess());
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
      if (!this.updatePaused) store.dispatch(updateAudio(meta));
    });
  }
  clearUpdateInterval() {
    console.log("interval from clear func:", this.updateInterval);
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
}
