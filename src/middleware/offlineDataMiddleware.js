// @flow
/**
 * This middleware is responsible of maintaining pending download tasks.
 */

import { removeMultiple, startDownload, cancelPendingTasks } from "../utils/DownloadMediaUtils";

function getNextDownloadTask(offlineGuide: ?OfflineGuide): ?DownloadTask {
  if (!offlineGuide) {
    return null;
  }

  const { downloadTasks } = offlineGuide;
  if (downloadTasks.length === 0) { return null; }

  // $FlowFixMe flow doesn't understand Object.values()
  return Object.values(downloadTasks).find((task: DownloadTask) => task.status === "not_started");
}

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "START_DOWNLOAD_GUIDE":
    case "RESUME_DOWNLOAD_GUIDE":
      {
        const { guide } = action;
        const offlineGuide: OfflineGuide = nextState.downloadedGuides.offlineGuides[guide.id];
        const nextTask: ?DownloadTask = getNextDownloadTask(offlineGuide);
        if (nextTask) {
          dispatch({ type: "DOWNLOAD_TASK_START", task: nextTask });
        }
      }
      break;
    case "PAUSE_DOWNLOAD_GUIDE": {
      const { guide } = action;
      cancelPendingTasks(`${guide.id}`);
      break;
    }
    case "CANCEL_DOWNLOAD_GUIDE": {
      const { guide } = action;
      // TODO abort pending download tasks!
      removeMultiple(`${guide.id}`)
        .then(id => console.log(`Successfully removed cached files for ${id}`))
        .catch(error => console.log(error));
      break;
    }
    case "DOWNLOAD_TASK_START": {
      const { task } = action;
      startDownload(`${task.guideId}`, task.url)
        .then(() => {
          dispatch({ type: "DOWNLOAD_TASK_SUCCESS", task });
        }).catch((error) => {
          dispatch({ type: "DOWNLOAD_TASK_FAILURE", task, error });
        });
      break;
    }
    case "DOWNLOAD_TASK_SUCCESS":
    case "DOWNLOAD_TASK_FAILURE":
    {
      const { task } = action;
      const { guideId } = task;
      const guide: ?OfflineGuide = nextState.downloadedGuides.offlineGuides[guideId];
      if (guide && guide.status === "pending") {
        const nextTask: ?DownloadTask = getNextDownloadTask(guide);
        if (nextTask) {
          dispatch({ type: "DOWNLOAD_TASK_START", task: nextTask });
        }
        // TODO: else verify downloads and retry failed tasks
      }
      break;
    }
    default:
      break;
  }

  return result;
};
