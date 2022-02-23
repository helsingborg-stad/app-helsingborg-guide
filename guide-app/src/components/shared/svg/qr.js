/* eslint-disable max-len */
import React from "react";
import { Svg, Path } from "react-native-svg";

type Props = {
  color: string,
};

export default function QR(props: Props) {

  return (
    <Svg width="30" height="30" viewBox="0 0 24 24"  stroke={props.color} xmlns="http://www.w3.org/2000/svg">
      <Path d="M6 6H8V8H6V6Z" stroke={props.color}/>
      <Path d="M3 11V3H11V11H3ZM5 5V9H9V5H5ZM13 13H16V15H13V13Z" stroke={props.color}/>
      <Path d="M16 15H18V13H21V16H18V17H19V18H21V21H19V19H17V21H13V17H15V19H16V15ZM18 6H16V8H18V6Z" stroke={props.color}/>
      <Path d="M13 3V11H21V3H13ZM19 5V9H15V5H19ZM6 16H8V18H6V16Z" stroke={props.color}/>
      <Path d="M3 21V13H11V21H3ZM5 15V19H9V15H5Z" stroke={props.color}/>
    </Svg>
  );

}
