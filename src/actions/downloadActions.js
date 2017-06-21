import * as types from './actionTypes';


export function createTaskSuccess(taskMeta) {
    return { type: types.CREATE_DOWNLOAD_TASK_SUCCESS, taskMeta };
}

export function cancelTaskSuccess(taskMeta) {
    //console.log('CANCEL_DOWNLOAD_TASK_SUCCESS');
    return { type: types.CANCEL_DOWNLOAD_TASK_SUCCESS, taskMeta };
}

export function resumeTaskSuccess(taskMeta) {
    return { type: types.RESUME_DOWNLOAD_TASK_SUCCESS, taskMeta };
}

export function clearCacheTaskSuccess(taskMeta) {
    return { type: types.CLEAR_CACHE_DOWNLOAD_TASK_SUCCESS, taskMeta };
}

export function taskProgressed(taskMeta) {
    return { type: types.DOWNLOAD_TASK_PROGRESSED, taskMeta };
}

export function taskCompleted(taskMeta) {
    return { type: types.DOWNLOAD_TASK_COMPLETED, taskMeta };
}

