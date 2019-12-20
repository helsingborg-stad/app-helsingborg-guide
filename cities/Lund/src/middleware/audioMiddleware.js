// @flow
/**
 * This middleware is responsible for forwarding audio actions to the mediaservice.
 * No one else is allowed. Just don't.
 */

import MediaService from "@services/mediaService";

function onAudioInited(dispatch: Dispatch, audio: AudioState) {
  dispatch({ type: "AUDIO_LOAD_FILE", audio });
}

function onAudioLoadSuccess(dispatch: Dispatch) {
  dispatch({ type: "AUDIO_LOAD_FILE_SUCCESS", prepared: true });
}

function onAudioUpdate(dispatch: Dispatch, audio: AudioState) {
  dispatch({ type: "AUDIO_UPDATE", audio });
}

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (
  action: Action
) => {
  const previousState = getState();
  const result = next(action);
  const nextState = getState();

  const mediaService = MediaService.getInstance();
  const guideID = previousState.uiState.currentGuide
    ? previousState.uiState.currentGuide.id
    : 0;

  switch (action.type) {
    case "AUDIO_TOGGLE_PLAY":
      if (nextState.audio.isPlaying) {
        mediaService.start();
      } else {
        mediaService.pause();
      }
      break;
    case "AUDIO_RELEASE_FILE":
      mediaService.release();
      break;
    case "AUDIO_MOVE_SLIDER":
      if (!previousState.audio.isMovingSlider) {
        mediaService.pauseUpdatingState();
      }
      break;
    case "AUDIO_PAUSE":
      mediaService.pause();
      break;
    case "AUDIO_MOVE_SLIDER_COMPLETE":
      mediaService.seekTo(action.position);
      mediaService.resumeUpdatingState();
      break;
    case "AUDIO_INIT_FILE":
      mediaService.loadAudioFile(
        action.audio,
        previousState.audio.hasAudio,
        guideID,
        audio => onAudioInited(dispatch, audio),
        () => onAudioLoadSuccess(dispatch),
        audio => onAudioUpdate(dispatch, audio)
      );

      break;
    default:
      break;
  }

  return result;
};
