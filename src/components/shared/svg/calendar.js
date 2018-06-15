import React from "react";
import {
  Svg,
  Circle,
  G,
  Path,
  Rect,
  Defs,
} from "react-native-svg";

export default function Calendar(props) {
  return (
    <Svg height="30" width="30" version="1.1" viewBox="0 0 24 24">
      <Defs />
      <G id="CALENDAR" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <Rect height="15" id="Rectangle-2" width="18" rx="1" stroke={props.color} strokeWidth="2" x="3" y="6" />
        <Path id="Path-5" d="M8.03515625,7.91052246 L8.03515625,2.91052246" stroke={props.color} strokeLinecap="round" strokeWidth="2" />
        <Path id="Path-5" d="M16,7.91052246 L16,2.91052246" stroke={props.color} strokeLinecap="round" strokeWidth="2" />
        <Circle id="Oval" x="8" y="11" fill={props.color} r="1" />
        <Circle id="Oval" x="12" y="11" fill={props.color} r="1" />
        <Circle id="Oval" x="16" y="11" fill={props.color} r="1" />
        <Circle id="Oval" x="8" y="14" fill={props.color} r="1" />
        <Circle id="Oval" x="12" y="14" fill={props.color} r="1" />
        <Circle id="Oval" x="16" y="14" fill={props.color} r="1" />
        <Circle id="Oval" x="8" y="17" fill={props.color} r="1" />
        <Circle id="Oval" x="12" y="17" fill={props.color} r="1" />
        <Circle id="Oval" x="16" y="17" fill={props.color} r="1" />
      </G>
    </Svg>
  );
}
