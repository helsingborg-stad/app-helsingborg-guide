// @flow
import RNFetchBlob, { type FetchBlobResponse, StatefulPromise } from "react-native-fetch-blob";

const basePath = RNFetchBlob.fs.dirs.CacheDir;

type PendingTask = StatefulPromise<FetchBlobResponse>;

/*
* Map with key "sessionId", containing maps with key "url".
*/
const pendingTasks: { [string]: { [string]: PendingTask } } = {};

function addPendingTask(sessionId: string, url: string, fetchPromise: PendingTask): void {
  let sessionTasks = pendingTasks[sessionId];
  if (!sessionTasks) {
    sessionTasks = {};
    pendingTasks[sessionId] = sessionTasks;
  }

  // cancel if already existing
  const existingTask: PendingTask = sessionTasks[url];
  if (existingTask) {
    existingTask.cancel((err, taskId) => console.log(`Successfully canceled taskId: ${taskId}`));
  }

  sessionTasks[url] = fetchPromise;
}

function removePendingTask(sessionId: string, url: string): void {
  const sessionTasks = pendingTasks[sessionId];
  if (sessionTasks) {
    const result = delete sessionTasks[url];
    if (result) console.log(`Removed pending task for ${sessionId}`);
  }
}

function removePendingTasks(sessionId: string): void {
  delete pendingTasks[sessionId];
}

export async function cancelPendingTasks(sessionId: string): Promise<any> {
  const sessionTasks = pendingTasks[sessionId];
  if (!sessionTasks) { return true; }

  // $FlowFixMe flow doesn't understand Object.values()
  const tasks: PendingTask[] = Object.values(sessionTasks);

  // collect all the cancel promises
  const promises = tasks.map(t => t.cancel());

  // waiting for all promises to resolve
  return Promise.all(promises);
}

export async function startDownload(sessionId: string, url: string): Promise<boolean> {
  const config = {
    fileCache: true,
    path: `${basePath}/${sessionId}/${url}`,
    session: sessionId,
  };

  const fetchPromise = RNFetchBlob.config(config).fetch("GET", url);
  fetchPromise
    .then(() => removePendingTask(sessionId, url))
    .catch(() => removePendingTask(sessionId, url));
  addPendingTask(sessionId, url, fetchPromise);
  return fetchPromise;
}

export async function remove(id: number, url: string): Promise<any> {
  const config = {
    fileCache: true,
    path: `${basePath}/${id}/${url}`,
  };

  try {
    await RNFetchBlob.fs.unlink(config.path);
    return url;
  } catch (error) {
    throw error;
  }
}

export async function removeMultiple(sessionId: string): Promise<any> {
  try {
    await cancelPendingTasks(sessionId);
  } catch (error) {
    console.log(error);
  }

  removePendingTasks(sessionId);

  try {
    await RNFetchBlob.session(sessionId).dispose();

    return sessionId;
  } catch (error) {
    throw new Error(`Failed to remove files for session ${sessionId}`);
  }
}
