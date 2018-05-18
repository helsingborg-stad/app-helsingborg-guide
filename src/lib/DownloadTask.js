import * as _ from "lodash";
import fetchService from "../services/FetchService";
import * as dActions from "../actions/downloadActions";
import LangService from "../services/langService";
import { errorHappened } from "../actions/errorActions";

const DEFAULT_AVATAR = "http://i.imgur.com/XMKOH81.jpg";

export default class DownloadTask {
  id;
  urls;
  completedUrls;
  fileDownloadTasks;
  isCanceled;
  startedAt;
  title;
  avatar;
  store;

  // reference to be used in sequence fetch and resume fetch.
  i;

  constructor(data, store) {
    this.id = data.id;
    this.i = data.currentPos || 0;
    this.isCanceled = data.isCanceled || false;
    this.urls = data.urls || [];
    this.startedAt = data.startedAt || new Date().toISOString();
    this.title = data.title || LangService.strings.UNKNOWN_TITLE;
    this.avatar = data.avatar || DEFAULT_AVATAR;
    this.completedUrls = data.currentPos ? _.slice(data.urls, 0, data.currentPos) : [];
    this.fileDownloadTasks = [];
    this.closedInfo = false;
    this.store = store;
  }

  fetchUrlsSeq() {
    return this._fetchUrl(this.urls[this.i]);
  }

  // sequence function. stops when the the list is completed or the task getting canceled.
  _fetchUrl(url) {
    if (this.isCanceled || this.isCompleted()) return null;
    const encoded = encodeURI(url);
    const mTask = fetchService.fetch(encoded, this.id);
    return mTask
      .then((res) => {
        if (res && !this.isCanceled) {
          res.session(`${this.id}`);
          console.log("download:file downloaded and stored in path ", res.path());
          this.completedUrls.push(url);
          // Add the task to this array to cancel it if we need to.
          this.fileDownloadTasks.push(mTask);

          if (this.isCompleted()) {
            this.store.dispatch(dActions.taskCompleted(this.getMeta()));
          } else {
            // debugger;
            this.store.dispatch(dActions.taskProgressed(this.getMeta()));
            // sequence call
            this.i += 1;
            this._fetchUrl(this.urls[this.i]);
          }
        }
      })
      .catch(() => {
        this.setIsCanceled(true);
        this.store.dispatch(dActions.cancelTaskSuccess(this.getMeta()));
      });
  }

  setIsCanceled(value) {
    this.isCanceled = value;
  }
  getUrlsList() {
    return this.urls;
  }
  getMeta() {
    return {
      urls: this.getUrlsList(),
      // completedUrls:this.completedUrls,
      currentPos: this.completedUrls.length,
      id: this.id,
      isCanceled: this.isCanceled,
      startedAt: this.startedAt,
      title: this.title,
      avatar: this.avatar,
      closedInfo: this.closedInfo,
    };
  }
  clearCompletedUrls() {
    this.completedUrls = [];
  }
  isCompleted() {
    return this.i === this.urls.length;
  }

  clearCache() {
    // cancel the task first then clear the cache
    this.cancelTask();
    fetchService.clearSessionCache(`${this.id}`).then(() => {
      this.clearCompletedUrls();
      this.store.dispatch(dActions.clearCacheTaskSuccess(this.getMeta()));
    }).catch(error => this.store.dispatch(errorHappened(error)));
  }

  cancelTask() {
    this.isCanceled = true;
    this.store.dispatch(dActions.cancelTaskSuccess(this.getMeta()));
    _.forEach(this.fileDownloadTasks, (mTask) => {
      //  debugger;
      if (mTask) {
        mTask.catch(() => { });
        mTask.cancel(() => { });
      }
    });
    this.fileDownloadTasks = [];
  }

  closeInfo() {
    this.closedInfo = true;
    this.store.dispatch(dActions.closedInfo(this.getMeta()));
  }

  resumeTask() {
    if (this.isCanceled) {
      this.setIsCanceled(false);
      this.store.dispatch(dActions.resumeTaskSuccess(this.getMeta()));
      this._fetchUrl(this.urls[this.i]);
    }
  }
}
