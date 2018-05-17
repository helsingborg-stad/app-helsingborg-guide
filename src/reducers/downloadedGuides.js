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
        download = { guide, progress: 0, status: "pending" };
      }

      // resuming
      download = { ...download, status: "pending" };
      const downloads = { ...state.downloads };
      downloads[guide.id] = download;
      return { ...state, downloads };
    }
    case "PAUSE_DOWNLOAD_GUIDE":
    default:
      return state;
  }
}
