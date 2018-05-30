// @flow

const defaultState: AudioState = {
  url: "",
  title: "",
  avatar_url: "",
  hasAudio: false,
  isPrepared: false,
  isPlaying: true,
  duration: 0,
  currentPosition: 0,
  isMovingSlider: false,
};

export default function audioReducer(state: AudioState = defaultState, action: Action): AudioState {
  switch (action.type) {
    case "LOAD_FILE_SUCCESS":
      return { ...state, isPrepared: true };
    case "LOAD_FILE":
      return action.audio;
    case "UPDATE_AUDIO":
      return Object.assign({}, state, action.audio);
    case "RELEASE_FILE":
      return Object.assign({}, defaultState);
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "MOVE_AUDIO_SLIDER":
      return { ...state, currentSliderPosition: action.position, isMovingSlider: true };
    case "MOVE_AUDIO_SLIDER_COMPLETE":
      return { ...state, currentSliderPosition: action.position, isMovingSlider: false };
    default:
      return state;
  }
}
