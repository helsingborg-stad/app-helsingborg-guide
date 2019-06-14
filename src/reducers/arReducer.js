// @flow

const defaultState: ARState = {
  angleDelta: 0,
  verticalAngle: 0,
  cameraPosition: [0, 0, 0],
};

export default function audioReducer(state: ARState = defaultState, action: Action): ARState {
  switch (action.type) {
    case "UPDATE_CAMERA_ANGLES":
      return { ...state, ...action.cameraAngles };
    case "UPDATE_CAMERA_POSITION":
      return { ...state, cameraPosition: action.cameraPosition };
    default:
      return state;
  }
}
