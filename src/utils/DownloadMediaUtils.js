// @flow
import RNFetchBlob from "react-native-fetch-blob";

const basePath = RNFetchBlob.fs.dirs.CacheDir;

export async function startDownload(sessionId: number, url: string): Promise<boolean> {
  try {
    const config = {
      fileCache: true,
      path: `${basePath}/${sessionId}/${url}`,
      session: sessionId,
    };

    const res = await RNFetchBlob.config(config).fetch("GET", url);
    console.log(res);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
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

function listFilesFromSession(sessionId: string): void {
  // TODO just for debugging
  const fsList: string[] = RNFetchBlob.session(sessionId).list();
  fsList.forEach(path => console.log(path));
  console.log();
}

export async function removeMultiple(sessionId: number): Promise<number> {
  console.log("BEFORE REMOVAL");

  listFilesFromSession(`${sessionId}`);

  try {
    await RNFetchBlob.session(sessionId).dispose();

    console.log("AFTER DELETION");
    listFilesFromSession(`${sessionId}`);

    return sessionId;
  } catch (error) {
    throw new Error(`Failed to remove files for session ${sessionId}`);
  }
}
