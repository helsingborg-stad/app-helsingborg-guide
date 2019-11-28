// @flow
import React, { Component } from "react";
import { ViroNode, ViroText, ViroImage, ViroAnimations } from "react-viro";

import { AnalyticsUtils } from "../../../../utils";
import * as Images from "../../../../images/AR";
import styles from "./styles";

type Props = {
  contentObject: ContentObject,
  position: Array<number>,
  onPress: (index: number) => void,
  active: boolean,
  distance: number,
  arrived: boolean,
};

const DISTANCE_SCALING_FACTOR = 2;

const RAISE_ANIMATION = "RAISE_ANIMATION";
const DROP_ANIMATION = "DROP_ANIMATION";
const PIN_ANIMATION = "PIN_ANIMATION";
const RESET_ANIMATION = "RESET_ANIMATION";

class Marker extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { arrived: props.arrived };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState) {
    const { arrived, contentObject: { title: name } } = nextProps;
    const { arrived: previouslyArrived } = prevState;

    if (arrived !== previouslyArrived) {
      if (arrived) AnalyticsUtils.logEvent("ar_arrived_at_object", { name });
      return { arrived };
    }

    return null;
  }

  render() {
    const {
      contentObject: { order },
      position,
      distance,
      onPress,
      active,
      arrived,
    } = this.props;
    const imagePin = (arrived && active && Images.PinArrived) || (active && Images.PinSelected) || Images.Pin;
    const animationName = active ? PIN_ANIMATION : RESET_ANIMATION;
    const animationLoop = active;
    const logarithmicScale = distance ? Math.log10(distance ** DISTANCE_SCALING_FACTOR) : 0;
    const scale = 1 + logarithmicScale;

    return (
      <ViroNode
        position={position}
        scale={[scale, scale, scale]}
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
    easing: "EaseInOut",
    duration: 250,
  },
  [RESET_ANIMATION]: {
    properties: {
      positionY: 0.5,
    },
    easing: "EaseInOut",
    duration: 250,
  },
  [PIN_ANIMATION]: [[RAISE_ANIMATION, DROP_ANIMATION]],
});

export default Marker;
