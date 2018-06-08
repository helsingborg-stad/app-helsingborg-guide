import React from "react";
import {
  Svg,
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop,
} from "react-native-svg";

export default function Home(props) {
  return (
    <Svg height="30" width="30" version="1.1" viewBox="0 0 24 24">
      <Defs />
      <G id="HOME" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <Path id="Path-3" d="M3,22 L9.05908203,22 L9.05908203,16.0106017 C9.03816732,13.3368672 10.0184733,12 12,12 C13.9815267,12 14.97229,13.3368672 14.97229,16.0106017 L14.97229,22 L21,22 C21.5522847,22 22,21.5522847 22,21 L22,9.10243292 C22,8.74526696 21.8095065,8.41521622 21.5002415,8.23654699 L12.5002415,3.03704748 C12.1907177,2.85822872 11.8092823,2.85822872 11.4997585,3.03704748 L2.4997585,8.23654699 C2.19049353,8.41521622 2,8.74526696 2,9.10243292 L2,21 C2,21.5522847 2.44771525,22 3,22 Z" stroke={props.color} strokeWidth="2" />
      </G>
    </Svg>
  );
}
