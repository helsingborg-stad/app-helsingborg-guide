// @flow
import React, { memo } from "react";
import { connect } from "react-redux";
import { ViroNode, ViroImage, ViroMaterials } from "react-viro";
import MathUtils from "../../../../utils/MathUtils";

const LINE_MATERIAL = "LINE_MATERIAL";

type Props = {
  cameraPosition: Array<number>,
  markerPosition: Array<number>,
}

ViroMaterials.createMaterials({
  [LINE_MATERIAL]: {
    blendMode: "Add",
  },
});

function DirectionLine({ cameraPosition: [cameraX, cameraY, cameraZ], markerPosition: [markerX, markerY, markerZ] }: Props) {
  const dx = markerX - cameraX;
  const dy = markerY - cameraY;
  const dz = markerZ - cameraZ;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const halfDistance = distance * 0.5;
  const angle = Math.atan2(dz, dx);

  const planePosition = [
    cameraX + Math.cos(angle) * halfDistance,
    -2,
    cameraZ + Math.sin(angle) * halfDistance,
  ];

  return (
    <ViroNode position={planePosition} rotation={[0, (270 - angle * MathUtils.RAD_TO_DEG), 0]}>
      <ViroImage
        rotation={[-90, 0, 0]}
        height={distance}
        width={1}
        source={require("../../../../images/AR/DirectionGuide.png")}
        format="RGBA8"
        imageClipMode="None"
        lightReceivingBitMask={0}
        materials={[LINE_MATERIAL]}
      />
    </ViroNode>
  );
}

const mapState = (state: RootState) => {
  const { arState: { cameraPosition } } = state;
  return { cameraPosition };
};

export default connect(mapState)(memo(DirectionLine));
