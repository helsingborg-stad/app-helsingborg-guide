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
      <G id="icon/calendar" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <Circle id="Oval" x="8" y="11" fill={props.color} r="1" />
        <Circle id="Oval" x="12" y="11" fill={props.color} r="1" />
        <Circle id="Oval" x="16" y="11" fill={props.color} r="1" />
        <Circle id="Oval" x="8" y="14" fill={props.color} r="1" />
        <Circle id="Oval" x="12" y="14" fill={props.color} r="1" />
        <Circle id="Oval" x="16" y="14" fill={props.color} r="1" />
        <Circle id="Oval" x="8" y="17" fill={props.color} r="1" />
        <Circle id="Oval" x="12" y="17" fill={props.color} r="1" />
        <Circle id="Oval" x="16" y="17" fill={props.color} r="1" />
        <Rect height="16" id="Rectangle" width="18" rx="2" stroke={props.color} strokeWidth="2" x="3" y="6" />
        <Path id="Rectangle-2" d="M8,2 L8,2 C8.55228475,2 9,2.44771525 9,3 L9,5 L7,5 L7,3 C7,2.44771525 7.44771525,2 8,2 Z" fill={props.color} />
        <Path id="Rectangle-2" d="M8,7 L8,7 C8.55228475,7 9,7.44771525 9,8 L9,9 L7,9 L7,8 C7,7.44771525 7.44771525,7 8,7 Z" fill={props.color} transform="translate(8.000000, 8.000000) scale(1, -1) translate(-8.000000, -8.000000) " />
        <Path id="Rectangle-2" d="M16,2 L16,2 C16.5522847,2 17,2.44771525 17,3 L17,5 L15,5 L15,3 C15,2.44771525 15.4477153,2 16,2 Z" fill={props.color} />
        <Path id="Rectangle-2" d="M16,7 L16,7 C16.5522847,7 17,7.44771525 17,8 L17,9 L15,9 L15,8 C15,7.44771525 15.4477153,7 16,7 Z" fill={props.color} transform="translate(16.000000, 8.000000) scale(1, -1) translate(-16.000000, -8.000000) " />
      </G>
    </Svg>
  );
}
