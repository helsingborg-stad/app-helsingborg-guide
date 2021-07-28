/* eslint-disable max-len */
import React from "react";
import { Svg, Path } from "react-native-svg";

type Props = {
  color: string,
};

export default function Settings(props: Props) {
  return (
    <Svg height="30" width="30" viewBox="0 0 28 28" fill="none" {...props}>
      <Path
        clipRule="evenodd"
        d="M13 16.273a3.273 3.273 0 100-6.546 3.273 3.273 0 000 6.546z"
        stroke="currentColor"
        strokeOpacity={0.75}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M21.073 16.273a1.8 1.8 0 00.36 1.985l.065.066a2.182 2.182 0 11-3.087 3.087l-.066-.066a1.8 1.8 0 00-1.985-.36 1.8 1.8 0 00-1.09 1.648v.185a2.182 2.182 0 11-4.364 0v-.098a1.8 1.8 0 00-1.179-1.647 1.8 1.8 0 00-1.985.36l-.066.065a2.182 2.182 0 11-3.087-3.087l.066-.066a1.8 1.8 0 00.36-1.985 1.8 1.8 0 00-1.648-1.09h-.185a2.182 2.182 0 110-4.364h.098a1.8 1.8 0 001.647-1.179 1.8 1.8 0 00-.36-1.985l-.065-.066A2.182 2.182 0 117.589 4.59l.066.066a1.8 1.8 0 001.985.36h.087a1.8 1.8 0 001.091-1.648v-.185a2.182 2.182 0 114.364 0v.098a1.8 1.8 0 001.09 1.647 1.8 1.8 0 001.986-.36l.066-.065a2.182 2.182 0 113.087 3.087l-.066.066a1.8 1.8 0 00-.36 1.985v.087a1.8 1.8 0 001.648 1.091h.185a2.182 2.182 0 110 4.364h-.098a1.8 1.8 0 00-1.647 1.09z"
        stroke="currentColor"
        strokeOpacity={0.75}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
