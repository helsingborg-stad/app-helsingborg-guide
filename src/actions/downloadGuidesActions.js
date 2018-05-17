// @flow

export function startDownload(guide: Guide): Action {
  return { type: "START_DOWNLOAD_GUIDE", guide };
}

export function resumeDownloadGuide(guide: Guide): Action {
  return { type: "RESUME_DOWNLOAD_GUIDE", guide };
}

export function pauseDownloadGuide(guide: Guide): Action {
  return { type: "PAUSE_DOWNLOAD_GUIDE", guide };
}

export function cancelDownloadGuide(guide: Guide): Action {
  return { type: "CANCEL_DOWNLOAD_GUIDE", guide };
}
