import * as types from './actionTypes';

export function loadAudioFile(audio) {
    return { type: types.LOAD_FILE, audio };
}

export function loadAudioFileSuccess() {
    return { type: types.LOAD_FILE_SUCCESS, prepared:true };
}

export function updateAudio(audio) {
    return { type: types.UPDATE_AUDIO, audio };
}

export function releaseAudioFile() {
    return { type: types.RELEASE_FILE };
}

export function togglePlay(isPlaying) {
    return { type: types.TOGGLE_PLAY, isPlaying };
}



