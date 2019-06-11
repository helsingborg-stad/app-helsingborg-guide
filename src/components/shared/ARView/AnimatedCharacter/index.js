// @flow

import React from "react";

import {
  ViroNode,
  ViroAmbientLight,
  ViroDirectionalLight,
  Viro3DObject,
  ViroAnimations,
  ViroMaterials,
} from "react-viro";

const CHARACTER_MATERIAL = "CHARACTER_MATERIAL";
const ANIMATION_CIRCLE = "ANIMATION_CIRCLE";
const FLIGHT_RADIUS = 10;
const FLIGHT_ALTITUDE = 5;
const FLIGHT_DURATION = 20000;

export default function AnimatedCharacter({ markerPosition: [x, , z] }) {
  const characterPosition = [x, 0, z];
  const flightAnimation = { name: ANIMATION_CIRCLE, run: true, loop: true, interruptible: true };

  return (
    <ViroNode>
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroDirectionalLight color="#FFFFFF" direction={[0, -1, 0]} castsShadow={false} />

      <ViroNode position={characterPosition} animation={flightAnimation}>
        <Viro3DObject
          position={[0, FLIGHT_ALTITUDE, FLIGHT_RADIUS]}
          rotation={[0, 90, 0]}
          scale={[0.01, 0.01, 0.01]}
          source={require("../../../../3D/seagull.vrx")}
          type="VRX"
          materials={[CHARACTER_MATERIAL]}
          resources={[
            require("../../../../3D/Mat_Seagull.png"),
            require("../../../../3D/Hat-512x512.png"),
            require("../../../../3D/Hat-512x512-Normal.png"),
            require("../../../../3D/Mat_Seagull_Specular.png"),
          ]}
          animation={{ name: "CINEMA_4D_Main", run: true, loop: true }}
        />
      </ViroNode>
    </ViroNode>
  );
}

ViroMaterials.createMaterials({
  [CHARACTER_MATERIAL]: {
    shininess: 1.0,
    lightingModel: "PBR",
  },
});

ViroAnimations.registerAnimations({
  [ANIMATION_CIRCLE]: { properties: { rotateY: "+=360" }, duration: FLIGHT_DURATION },
});
