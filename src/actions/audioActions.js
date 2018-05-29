import * as types from "./actionTypes";

// TODO: move types to helsingborg.js and flow this one.

export function loadAudioFile(audio) {
  return { type: types.LOAD_FILE, audio };
}

export function loadAudioFileSuccess() {
  return { type: types.LOAD_FILE_SUCCESS, prepared: true };
}

export function updateAudio(audio) {
  return { type: types.UPDATE_AUDIO, audio };
}

export function releaseAudioFile() {
  return { type: types.RELEASE_FILE };
}

export function togglePlay() {
  return { type: types.TOGGLE_PLAY };
}

export function moveAudioSlider(position) {
  return { type: types.MOVE_AUDIO_SLIDER, position };
}

export function moveAudioSliderComplete(position) {
  return { type: types.MOVE_AUDIO_SLIDER_COMPLETE, position };
}
