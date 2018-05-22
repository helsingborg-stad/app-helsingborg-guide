// @flow
import { removeMultiple, startDownload } from "../utils/DownloadMediaUtils";

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "START_DOWNLOAD_GUIDE":
      {
        const { guide } = action;
        const downloadData: OfflineGuide = nextState.downloadedGuides.offlineGuides[guide.id];
        const { downloadTasks } = downloadData;

        // $FlowFixMe flow doesn't understand Object.values()
        const tasks: DownloadTask[] = Object.values(downloadTasks);
        if (tasks.length > 0) {
          const task: DownloadTask = tasks[0];
          dispatch({ type: "DOWNLOAD_TASK_START", task });
        }
      }
      break;
    case "CANCEL_DOWNLOAD_GUIDE": {
      const { guide } = action;
      removeMultiple(guide.id)
        .then(id => console.log(`Successfully removed cached files for ${id}`))
        .catch(error => console.log(error));
      break;
    }
    case "DOWNLOAD_TASK_START": {
      const { task } = action;
      startDownload(task.guideId, task.url)
        .then(() => {
          dispatch({ type: "DOWNLOAD_TASK_SUCCESS", task });
        }).catch((error) => {
          dispatch({ type: "DOWNLOAD_TASK_FAILURE", task, error });
        });
      break;
    }
    default:
      break;
  }

  return result;
};
