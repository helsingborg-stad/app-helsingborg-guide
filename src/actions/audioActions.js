// @flow

export function loadAudioFile(audio: AudioState): Action {
  return { type: "LOAD_FILE", audio };
}

export function loadAudioFileSuccess(): Action {
  return { type: "LOAD_FILE_SUCCESS", prepared: true };
}

export function updateAudio(audio: AudioState): Action {
  return { type: "UPDATE_AUDIO", audio };
}

export function releaseAudioFile(): Action {
  return { type: "RELEASE_FILE" };
}

export function togglePlay(): Action {
  return { type: "TOGGLE_PLAY" };
}

export function moveAudioSlider(position: number): Action {
  return { type: "MOVE_AUDIO_SLIDER", position };
}

export function moveAudioSliderComplete(position: number): Action {
  return { type: "MOVE_AUDIO_SLIDER_COMPLETE", position };
}
