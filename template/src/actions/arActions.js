// @flow

export function updateCameraAngles(cameraAngles: ARState): Action {
  return { type: "UPDATE_CAMERA_ANGLES", cameraAngles };
}
