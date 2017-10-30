/**
 * Created by msaeed on 2017-04-10.
 */
/**
 * Created by msaeed on 2017-03-29.
 */
import { FetchService } from "../services/FetchService";
import * as _ from "lodash";
import store from "../store/configureStore";
import * as dActions from "../actions/downloadActions";
import { LangService } from "../services/langService";

const DEFAULT_AVATAR = "http://i.imgur.com/XMKOH81.jpg";

export class DownloadTask {
  id;
  urls;
  completedUrls;
  fetchService;
  fileDownloadTasks;
  isCanceled;
  startedAt;
  title;
  avatar;

  // reference to be used in sequence fetch and resume fetch.
  i;

  constructor(data) {
    this.id = data.id;
    this.i = data.currentPos || 0;
    this.isCanceled = data.isCanceled || false;
    this.urls = data.urls || [];
    this.startedAt = data.startedAt || new Date().toISOString();
    this.title = data.title || LangService.strings.UNKNOWN_TITLE;
    this.avatar = data.avatar || DEFAULT_AVATAR;
    this.completedUrls = data.currentPos ? _.slice(data.urls, 0, data.currentPos) : [];
    this.fileDownloadTasks = [];
    this.fetchService = FetchService.getInstance();
  }

  // not used.
  fetchUrls() {
    _.forEach(this.urls, (url) => {
      const mTask = this.fetchService.fetch(url);
      mTask
        .then((res) => {
          if (res) {
            this.completedUrls.push(url);
            if (this.isCompleted()) store.dispatch(dActions.taskCompleted(this.getMeta()));
            else store.dispatch(dActions.taskProgressed(this.getMeta()));
          }
        })
        .catch((error) => {
          console.log("error in fetching url.maybe canceled");
        });
      // Add the task to this array to cancel it if we need to.
      this.fileDownloadTasks.push(mTask);
    });
  }

  fetchUrlsSeq() {
    return this._fetchUrl(this.urls[this.i]);
  }

  // sequence function. stops when the the list is completed or the task getting canceled.
  _fetchUrl(url) {
    if (this.isCanceled || this.isCompleted()) return;
    const mTask = this.fetchService.fetch(url);
    return mTask
      .then((res) => {
        if (res && !this.isCanceled) {
          res.session(`${this.id}`);
          console.log("download:file downloaded and stored in path ", res.path());
          this.completedUrls.push(url);
          // Add the task to this array to cancel it if we need to.
          this.fileDownloadTasks.push(mTask);

          if (this.isCompleted()) {
            store.dispatch(dActions.taskCompleted(this.getMeta()));
          } else {
            // debugger;
            store.dispatch(dActions.taskProgressed(this.getMeta()));
            // sequence call
            this.i++;
            this._fetchUrl(this.urls[this.i]);
          }
        }
      })
      .catch((error) => {
        this.setIsCanceled(true);
        store.dispatch(dActions.cancelTaskSuccess(this.getMeta()));
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
    };
  }
  clearCompletedUrls() {
    this.completedUrls = [];
  }
  isCompleted() {
    return this.i == this.urls.length;
  }

  clearCache() {
    // cancel the task first then clear the cache
    this.cancelTask();
    this.fetchService.clearSessionCache(`${this.id}`).then(() => {
      this.clearCompletedUrls();
      store.dispatch(dActions.clearCacheTaskSuccess(this.getMeta()));
    });
    // _.forEach(this.completedUrls,url=>{
    //     this.fetchService.clearCache(this.fetchService.getFullPath(url))
    //         .then(()=> console.log(`Cache cleared ${url}`));
    // });
  }

  cancelTask() {
    this.isCanceled = true;
    store.dispatch(dActions.cancelTaskSuccess(this.getMeta()));
    _.forEach(this.fileDownloadTasks, (mTask) => {
      //  debugger;
      if (mTask) {
        mTask.catch((err) => {});
        mTask.cancel((err) => {});
      }
    });
    this.fileDownloadTasks = [];
  }

  resumeTask() {
    if (this.isCanceled) {
      this.setIsCanceled(false);
      store.dispatch(dActions.resumeTaskSuccess(this.getMeta()));
      this._fetchUrl(this.urls[this.i]);
    }
  }
}
