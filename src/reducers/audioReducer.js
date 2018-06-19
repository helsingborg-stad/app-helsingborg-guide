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
    case "AUDIO_LOAD_FILE_SUCCESS":
      return { ...state, isPrepared: true };
    case "AUDIO_LOAD_FILE":
      return action.audio;
    case "AUDIO_INIT_FILE":
      return action.audio;
    case "AUDIO_UPDATE":
      return Object.assign({}, state, action.audio);
    case "AUDIO_RELEASE_FILE":
      return Object.assign({}, defaultState);
    case "AUDIO_TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "AUDIO_PAUSE":
      return { ...state, isPlaying: false };
    case "AUDIO_MOVE_SLIDER":
      return { ...state, currentSliderPosition: action.position, isMovingSlider: true };
    case "AUDIO_MOVE_SLIDER_COMPLETE":
      return { ...state, currentSliderPosition: action.position, isMovingSlider: false };
    default:
      return state;
  }
}
