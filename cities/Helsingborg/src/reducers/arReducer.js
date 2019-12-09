// @flow

const defaultState: ARState = {
  angleDelta: 0,
  verticalAngle: 0
};

export default function audioReducer(
  state: ARState = defaultState,
  action: Action
): ARState {
  switch (action.type) {
    case "UPDATE_CAMERA_ANGLES":
      return action.cameraAngles;
    default:
      return state;
  }
}
