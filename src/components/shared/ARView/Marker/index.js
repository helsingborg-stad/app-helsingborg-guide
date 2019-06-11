// @flow
import React, { Component } from "react";
import { ViroNode, ViroText, ViroImage, ViroAnimations } from "react-viro";
import { AnalyticsUtils } from "../../../../utils";
import * as Images from "../../../../images/AR";
import styles from "./styles";

type Props = {
  marker: {
    contentObject: ContentObject,
    position: Array<number>,
  },
  onPress: (index: number) => void,
  active: boolean,
  arrived: boolean,
};

const RAISE_ANIMATION = "RAISE_ANIMATION";
const DROP_ANIMATION = "DROP_ANIMATION";
const PIN_ANIMATION = "PIN_ANIMATION";
const RESET_ANIMATION = "RESET_ANIMATION";

class Marker extends Component<Props> {
  componentWillReceiveProps(props: Props) {
    const { arrived, marker } = this.props;

    if (!arrived && props.arrived) {
      const {
        contentObject: { title },
      } = marker;

      AnalyticsUtils.logEvent("ar_arrived_at_object", { name: title });
    }
  }

  render() {
    const { marker, onPress, active, arrived } = this.props;
    const {
      contentObject: { order },
      position,
    } = marker;
    const scaleMod = 1; // distance / 100; // 1; //Math.log(distance);
    const scale = [1 * scaleMod, 1 * scaleMod, 1 * scaleMod];
    const imagePin = (arrived && active && Images.PinArrived) || (active && Images.PinSelected) || Images.Pin;
    const animationName = active ? PIN_ANIMATION : RESET_ANIMATION;
    const animationLoop = active;

    return (
      <ViroNode
        position={position}
        scale={scale}
        width={0.6}
        height={0.6}
        transformBehaviors="billboard"
        onClick={() => {
          onPress(order);
        }}
        animation={{
          name: animationName,
          run: true,
          loop: animationLoop,
          interruptible: true,
        }}
      >
        {imagePin !== Images.PinArrived && (
          <ViroText
            text={`${order + 1}`}
            style={active ? styles.textActive : styles.text}
            extrusionDepth={3}
            position={[0, -0.075, 0]}
            textAlign="Center"
            textAlignVertical="Center"
          />
        )}
        <ViroImage source={imagePin} width={0.6} height={0.6} position={[0, 0, 0]} />
      </ViroNode>
    );
  }
}

ViroAnimations.registerAnimations({
  [RAISE_ANIMATION]: {
    properties: {
      positionY: 1.0,
    },
    easing: "EaseInOut",
    duration: 500,
    delay: 500,
  },
  [DROP_ANIMATION]: {
    properties: {
      positionY: 0.5,
    },
    easing: "Bounce",
    duration: 250,
  },
  [RESET_ANIMATION]: {
    properties: {
      positionY: 0.5,
    },
    easing: "Bounce",
    duration: 250,
  },
  [PIN_ANIMATION]: [[RAISE_ANIMATION, DROP_ANIMATION]],
});

export default Marker;
