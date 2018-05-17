import { getUrlsFromGuide } from "../utils/UrlUtils";

// @flow
const defaultState: DownloadedGuidesState = {
  downloads: {},
};

export default function reducer(state: DownloadedGuidesState = defaultState, action: Action): DownloadedGuidesState {
  switch (action.type) {
    case "START_DOWNLOAD_GUIDE":
    case "RESUME_DOWNLOAD_GUIDE":
    {
      const { guide } = action;
      let download: DownloadedGuide = state.downloads[guide.id];
      if (!download) {
        // starting from scratch
        // TODO zero progress as default
        download = { guide, progress: 0, status: "pending", mediaUrls: getUrlsFromGuide(guide) };
      }

      // resuming
      download = { ...download, status: "pending" };
      const downloads = { ...state.downloads };
      downloads[guide.id] = download;
      return { ...state, downloads };
    }
    case "PAUSE_DOWNLOAD_GUIDE":
    {
      const { guide } = action;
      const oldDownload: DownloadedGuide = state.downloads[guide.id];
      if (oldDownload) {
        const nextDownload: DownloadedGuide = { ...oldDownload, status: "paused" };
        const downloads = { ...state.downloads };
        downloads[guide.id] = nextDownload;
        return { ...state, downloads };
      }
      return state;
    }
    case "CANCEL_DOWNLOAD_GUIDE":
    {
      const { guide } = action;
      const oldDownload: DownloadedGuide = state.downloads[guide.id];
      if (oldDownload) {
        const downloads = { ...state.downloads };
        delete downloads[guide.id];
        return { ...state, downloads };
      }
      return state;
    }
    default:
      return state;
  }
}
