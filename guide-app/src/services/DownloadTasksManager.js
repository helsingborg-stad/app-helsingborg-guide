import * as _ from "lodash";
import DownloadTask from "@src/lib/DownloadTask";
import * as dActions from "@actions/downloadActions";

class DownloadTasksManager {
  // TODO decouple store from this class
  store;
  tasks = [];
  currentDownloadedDataVersion = 2; // Bump if any changes to how we store downloaded data.

  // ######################################

  loadExistingTasks(downloads) {
    // debugger;
    this.tasks = [];
    if (!downloads.length) {
      return;
    }
    _.forEach(downloads, (item) => {
      const task = this.createTask(item, true);
      if (task && !task.isCanceled) {
        this.startTask(task.id);
      }
    });
  }

  purgeExistingTasks(downloads) {
    if (!downloads.length) {
      return;
    }

    _.forEach(downloads, (item) => {
      const task = this.getTaskById(item.id);
      if (task) {
        this.cancelTask(task.id);
        this.clearCache(task.id);
      }
    });
  }

  checkForInvalidData(downloads, savedDownloadDataVersion) {
    if (downloads && downloads.length) {
      if (
        !savedDownloadDataVersion ||
        Number(savedDownloadDataVersion.version) <
          Number(this.currentDownloadedDataVersion)
      ) {
        this.purgeExistingTasks(downloads);
      }
    }
    this.store.dispatch(
      dActions.setDownloadDataVersion(this.currentDownloadedDataVersion)
    );
  }

  getTaskById(id) {
    return this.tasks.find((item) => item.id === id);
  }
  isExist(id) {
    return !!this.getTaskById(id);
  }

  createTask(data, resumed = false) {
    if (this.isExist(data.id)) {
      return false;
    }

    const task = new DownloadTask(data, this.store);
    this.tasks.push(task);
    if (!resumed) {
      this.store.dispatch(dActions.createTaskSuccess(task.getMeta()));
    }
    return task;
  }

  startTask(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return;
    }
    task.fetchUrlsSeq();
  }

  resumeTask(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return;
    }
    task.resumeTask();
  }

  cancelTask(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return;
    }
    task.cancelTask();
  }

  setClosedInfo(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return;
    }
    task.closeInfo();
  }

  clearCache(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return;
    }
    task.clearCache();
    this.tasks = _.reject(this.tasks, { id: task.id });
  }
}

const instance = new DownloadTasksManager();
export default instance;
