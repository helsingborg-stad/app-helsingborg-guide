// @flow

const defaultState: UIState = {
  currentGuideGroup: null,
};

export default function uiStateReducer(state: UIState = defaultState, action: Action): UIState {
  switch (action.type) {
    case "SELECT_CURRENT_GUIDEGROUP":
      return { ...state, currentGuideGroup: action.guideGroup };
    default:
      return state;
  }
}
