// @flow
/**
 * This middleware is responsible for forwarding audio actions to the mediaservice
 */

import MediaService from "../services/mediaService";

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const previousState = getState();
  const result = next(action);
  const nextState = getState();


  const mediaService = MediaService.getInstance();


  switch (action.type) {
    case "AUDIO_TOGGLE_PLAY":
      if (nextState.audio.isPlaying) { mediaService.start(); } else { mediaService.pause(); }
      break;
    case "AUDIO_RELEASE_FILE":
      mediaService.release();
      break;
    case "AUDIO_MOVE_SLIDER":
      if (!previousState.audio.isMovingSlider) { mediaService.pauseUpdatingState(); }
      break;
    case "AUDIO_MOVE_SLIDER_COMPLETE":
      mediaService.seekTo(action.position);
      mediaService.resumeUpdatingState();
      break;
    default:
      break;
  }

  return result;
};
