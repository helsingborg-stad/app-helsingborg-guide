// @flow

export function updateCameraAngles(cameraAngles: Object): Action {
  return { type: "UPDATE_CAMERA_ANGLES", cameraAngles };
}

export function updateCameraPosition(cameraPosition: Array<number>): Action {
  return { type: "UPDATE_CAMERA_POSITION", cameraPosition };
}
