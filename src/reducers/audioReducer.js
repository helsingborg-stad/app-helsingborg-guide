import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function audioReducer(state = initialState.audio, action) {
  const newAudio = Object.assign({}, state);
  switch (action.type) {
    case types.LOAD_FILE_SUCCESS:
      newAudio.isPrepared = true;
      return newAudio;
    case types.LOAD_FILE:
      return action.audio;
    case types.UPDATE_AUDIO:
      return Object.assign({}, state, action.audio);
    case types.RELEASE_FILE:
      return Object.assign({}, initialState.audio);
    case types.TOGGLE_PLAY:
      newAudio.isPlaying = action.isPlaying;
      return newAudio;
    default:
      return state;
  }
}
