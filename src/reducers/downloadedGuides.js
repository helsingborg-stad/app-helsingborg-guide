// @flow
import { getUrlsFromGuide } from "../utils/UrlUtils";

const defaultState: DownloadedGuidesState = {
  offlineGuides: {},
};

function getProgress(tasks: { [string]: DownloadTask }): number {
  // $FlowFixMe flow doesn't understand Object.values()
  const values: DownloadTask[] = Object.values(tasks);
  const totalCount = values.length;

  if (totalCount === 0) return 1;

  const totalDone: number = values.reduce((count, task) => {
    if (task.status === "done") {
      return count + 1;
    }
    return count;
  }, 0);

  return totalDone / totalCount;
}

function updateDownloadTaskStatus(offlineGuide: OfflineGuide, url: string, status: TaskStatus): OfflineGuide {
  const nextGuide = { ...offlineGuide };

  const nextTasks = { ...offlineGuide.downloadTasks };
  nextTasks[url] = { ...nextTasks[url], status };

  const progress = getProgress(nextTasks);
  nextGuide.progress = progress;
  if (progress === 1) {
    nextGuide.status = "done";
  }

  nextGuide.downloadTasks = nextTasks;

  return nextGuide;
}

function updateTaskStatusAndProgress(state: DownloadedGuidesState, task: DownloadTask, status: TaskStatus): DownloadedGuidesState {
  const { guideId } = task;
  const offlineGuide: OfflineGuide = state.offlineGuides[guideId];
  if (offlineGuide) {
    // replace offline guide
    const nextOfflineGuide = updateDownloadTaskStatus(offlineGuide, task.url, status);
    const offlineGuides = { ...state.offlineGuides };
    offlineGuides[guideId] = nextOfflineGuide;

    return { ...state, offlineGuides };
  }
  return state;
}

export default function reducer(state: DownloadedGuidesState = defaultState, action: Action): DownloadedGuidesState {
  switch (action.type) {
    case "START_DOWNLOAD_GUIDE":
    case "RESUME_DOWNLOAD_GUIDE":
    {
      const { guide } = action;
      let offlineGuide: OfflineGuide = state.offlineGuides[guide.id];
      if (!offlineGuide) {
        // starting from scratch
        const { id: guideId } = guide;
        const mediaUrls = getUrlsFromGuide(guide);
        if (mediaUrls.length === 0) {
          // No content to download
          return state;
        }

        const downloadTasks: { [string]: DownloadTask } = {};
        mediaUrls.forEach((url) => {
          downloadTasks[url] = { guideId, url, status: "not_started" };
        });

        offlineGuide = {
          guide,
          progress: 0,
          status: "pending",
          downloadTasks,
        };
      }

      // resuming
      offlineGuide = { ...offlineGuide, status: "pending" };
      const offlineGuides = { ...state.offlineGuides };
      offlineGuides[guide.id] = offlineGuide;
      return { ...state, offlineGuides };
    }
    case "PAUSE_DOWNLOAD_GUIDE":
    {
      const { guide } = action;
      const oldDownload: OfflineGuide = state.offlineGuides[guide.id];
      if (oldDownload) {
        const nextDownload: OfflineGuide = { ...oldDownload, status: "paused" };
        const offlineGuides = { ...state.offlineGuides };
        offlineGuides[guide.id] = nextDownload;
        return { ...state, offlineGuides };
      }
      return state;
    }
    case "CANCEL_DOWNLOAD_GUIDE":
    {
      const { guide } = action;
      const offlineGuide: OfflineGuide = state.offlineGuides[guide.id];
      if (offlineGuide) {
        const offlineGuides = { ...state.offlineGuides };
        delete offlineGuides[guide.id];
        return { ...state, offlineGuides };
      }
      return state;
    }
    case "DOWNLOAD_TASK_START":
      return updateTaskStatusAndProgress(state, action.task, "pending");
    case "DOWNLOAD_TASK_FAILURE":
      return updateTaskStatusAndProgress(state, action.task, "failed");
    case "DOWNLOAD_TASK_SUCCESS":
      return updateTaskStatusAndProgress(state, action.task, "done");
    default:
      return state;
  }
}
