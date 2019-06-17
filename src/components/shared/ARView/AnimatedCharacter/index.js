// @flow
import React from "react";
import { ViroNode, ViroAmbientLight, ViroDirectionalLight, Viro3DObject, ViroAnimations, ViroMaterials } from "react-viro";

type Props = {
  markerPosition: Array<number>,
};

const seagullModel = require("../../../../3D/seagull.vrx");
const seagullTexture = require("../../../../3D/Mat_Seagull.png");
const hatTexture = require("../../../../3D/Hat-512x512.png");
const seagullNormal = require("../../../../3D/Hat-512x512-Normal.png");
const seagullSpecular = require("../../../../3D/Mat_Seagull_Specular.png");

const CHARACTER_MATERIAL = "CHARACTER_MATERIAL";
const ANIMATION_CIRCLE = "ANIMATION_CIRCLE";
const FLIGHT_RADIUS = 10;
const FLIGHT_ALTITUDE = 5;
const FLIGHT_DURATION = 20000;

export default function AnimatedCharacter({ markerPosition: [x, , z] }: Props) {
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
          source={seagullModel}
          type="VRX"
          materials={[CHARACTER_MATERIAL]}
          resources={[seagullTexture, hatTexture, seagullNormal, seagullSpecular]}
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
    normalTexture: seagullNormal,
    specularTexture: seagullSpecular,
  },
});

ViroAnimations.registerAnimations({
  [ANIMATION_CIRCLE]: { properties: { rotateY: "+=360" }, duration: FLIGHT_DURATION },
});
