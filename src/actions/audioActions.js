// @flow

export function loadAudioFile(audio: AudioState): Action {
  return { type: "AUDIO_LOAD_FILE", audio };
}

export function loadAudioFileSuccess(): Action {
  return { type: "AUDIO_LOAD_FILE_SUCCESS", prepared: true };
}

export function updateAudio(audio: AudioState): Action {
  return { type: "AUDIO_UPDATE", audio };
}

export function releaseAudioFile(): Action {
  return { type: "AUDIO_RELEASE_FILE" };
}

export function togglePlay(): Action {
  return { type: "AUDIO_TOGGLE_PLAY" };
}

export function moveAudioSlider(position: number): Action {
  return { type: "AUDIO_MOVE_SLIDER", position };
}

export function moveAudioSliderComplete(position: number): Action {
  return { type: "AUDIO_MOVE_SLIDER_COMPLETE", position };
}
