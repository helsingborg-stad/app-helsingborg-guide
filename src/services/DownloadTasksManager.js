import * as _ from "lodash";
import DownloadTask from "../lib/DownloadTask";
import store from "../store/configureStore";
import * as dActions from "../actions/downloadActions";

let instance = null;

export default class DownloadTasksManager {
  tasks = [];

  constructor() {}
  static getInstance() {
    if (!instance) instance = new DownloadTasksManager();
    return instance;
  }
  // ######################################

  loadExistingTasks(downloads) {
    // debugger;
    this.tasks = [];
    // console.log('downloads',downloads);
    if (!downloads.length) return;
    // console.log('loop and create and start the existing tasks');
    _.forEach(downloads, (item) => {
      const task = this.createTask(item, true);
      if (task && !task.isCanceled) this.startTask(task.id);
    });
  }

  getTaskById(id) {
    return this.tasks.find(item => item.id == id);
  }
  isExist(id) {
    return !!this.getTaskById(id);
  }

  createTask(data, resumed = false) {
    if (this.isExist(data.id)) return false;
    // console.log('download:Creating a new task', data.id);

    const task = new DownloadTask(data);
    this.tasks.push(task);
    if (!resumed) store.dispatch(dActions.createTaskSuccess(task.getMeta()));
    return task;
  }

  startTask(id) {
    const task = this.getTaskById(id);
    if (!task) return;
    task.fetchUrlsSeq();
  }

  resumeTask(id) {
    const task = this.getTaskById(id);
    if (!task) return;
    task.resumeTask();
  }

  cancelTask(id) {
    const task = this.getTaskById(id);
    if (!task) return;
    task.cancelTask();
  }

  clearCache(id) {
    const task = this.getTaskById(id);
    if (!task) return;
    task.clearCache();
    this.tasks = _.reject(this.tasks, { id: task.id });
  }
  storeTasksMeta() {}
  getTasksMeta() {}
}
