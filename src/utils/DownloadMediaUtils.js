// @flow
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

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
    existingTask.cancel();
  }

  sessionTasks[url] = fetchPromise;
}

function removePendingTask(sessionId: string, url: string): void {
  const sessionTasks = pendingTasks[sessionId];
  if (sessionTasks) {
    delete sessionTasks[url];
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
    .then((res) => {
      console.log("Successfully downloaded to: ", res.path());
      removePendingTask(sessionId, url);
    })
    .catch(() => removePendingTask(sessionId, url));
  addPendingTask(sessionId, url, fetchPromise);
  return fetchPromise;
}

export async function remove(sessionId: number, url: string): Promise<any> {
  const config = {
    fileCache: true,
    path: `${basePath}/${sessionId}/${url}`,
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
    // don't care
  }

  removePendingTasks(sessionId);

  try {
    await RNFetchBlob.session(sessionId).dispose();

    return sessionId;
  } catch (error) {
    throw new Error(`Failed to remove files for session ${sessionId}`);
  }
}

export function getFilePathInCache(sessionId: string, url: string) {
  const path = `${basePath}/${sessionId}/${url}`;
  return path;
}

export async function loadFromCache(sessionId: string, url: string): Promise<any> {
  console.log(`loadFromCache: ${sessionId}`);
  let path = getFilePathInCache(sessionId, url);
  path = Platform.OS === "android" ? `file://${path}` : path;
  const fetchPromise = RNFetchBlob.fs.readFile(path, "base64");

  fetchPromise
    .then(() => console.log(`read cache HIT (${path})`))
    .catch(() => console.log(`read cache MISS(${path})`));

  return fetchPromise;
}

export async function isFileInCache(sessionId: string, url: string): Promise<boolean> {
  let path = getFilePathInCache(sessionId, url);
  path = Platform.OS === "android" ? `file://${path}` : path;
  try {
    const exists = await RNFetchBlob.fs.exists(path);
    console.log(`cache exist ${exists} (${path})`);
    return exists;
  } catch (error) {
    console.log(`cache exist error  ${error}`);

    throw error;
  }
}

export default {
  cancelPendingTasks,
  startDownload,
  remove,
  removeMultiple,
};

