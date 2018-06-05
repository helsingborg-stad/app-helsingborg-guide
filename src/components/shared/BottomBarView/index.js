// @flow

import React from "react";
import SVGImage from "react-native-remote-svg";
import { View, Image, SafeAreaView, TouchableOpacity } from "react-native";
import styles from "./style";

const barBackground = require("../../../images/background-navigation.png");
const barTabLeft = require("../../../images/bottom-left2.png");
const barTabCenter = require("../../../images/bottom-center2.png");
const barTabRight = require("../../../images/bottom-right2.png");

type Props = {
  currentBottomBarTab: number,
  onSelectTab: any,
}

function displayButtonTabs() {
  return (
    <View style={styles.buttonTabContainer}>
      <Image style={styles.imageTab} source={currentBottomBarTab === 0 ? barTabLeft : null} />
      <Image style={styles.imageTab} source={currentBottomBarTab === 1 ? barTabCenter : null} />
      <Image style={styles.imageTab} source={currentBottomBarTab === 2 ? barTabRight : null} />
    </View>
  );
}
function displayIcons(currentBottomBarTab: number, onSelectTab: any) {
  const leftColor = currentBottomBarTab === 0 ? selectedColor : inactiveColor;
  const centerColor = currentBottomBarTab === 1 ? selectedColor : inactiveColor;
  const rightColor = currentBottomBarTab === 2 ? selectedColor : inactiveColor;

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => onSelectTab(0)}>
        <SVGImage
          source={{
            uri: `data:image/svg+xml;utf8,<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs></defs>
          <g id="HOME" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
              <path d="M3,22 L9.05908203,22 L9.05908203,16.0106017 C9.03816732,13.3368672 10.0184733,12 12,12 C13.9815267,12 14.97229,13.3368672 14.97229,16.0106017 L14.97229,22 L21,22 C21.5522847,22 22,21.5522847 22,21 L22,9.10243292 C22,8.74526696 21.8095065,8.41521622 21.5002415,8.23654699 L12.5002415,3.03704748 C12.1907177,2.85822872 11.8092823,2.85822872 11.4997585,3.03704748 L2.4997585,8.23654699 C2.19049353,8.41521622 2,8.74526696 2,9.10243292 L2,21 C2,21.5522847 2.44771525,22 3,22 Z" id="Path-3" stroke="#ffffff" stroke-width="2"></path>
          </g>
      </svg>`,
          }}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => onSelectTab(1)}>
        <SVGImage
          source={{
            uri: `data:image/svg+xml;utf8,<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs></defs>
          <g id="CALENDAR" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <rect id="Rectangle-2" stroke="#ffffff" stroke-width="2" x="3" y="6" width="18" height="15" rx="1"></rect>
              <path d="M8.03515625,7.91052246 L8.03515625,2.91052246" id="Path-5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M16,7.91052246 L16,2.91052246" id="Path-5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <circle id="Oval" fill="#ffffff" cx="8" cy="11" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="12" cy="11" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="16" cy="11" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="8" cy="14" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="12" cy="14" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="16" cy="14" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="8" cy="17" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="12" cy="17" r="1"></circle>
              <circle id="Oval" fill="#ffffff" cx="16" cy="17" r="1"></circle>
          </g>
      </svg>`,
          }}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => onSelectTab(2)} >
        <SVGImage
          source={{
            uri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
          <g id="surface1">
          <path style=" " fill="#ffffff" d="M 19.398438 13 C 19.398438 12.699219 19.5 12.300781 19.5 12 C 19.5 11.699219 19.5 11.300781 19.398438 11 L 21.5 9.5 C 21.699219 9.398438 21.800781 9.101563 21.601563 8.800781 L 19.601563 5.300781 C 19.5 5 19.199219 4.898438 19 5 L 16.601563 6.101563 C 16.101563 5.699219 15.398438 5.300781 14.800781 5.101563 L 14.5 2.5 C 14.5 2.199219 14.300781 2 14 2 L 10 2 C 9.699219 2 9.5 2.199219 9.5 2.5 L 9.199219 5 C 8.5 5.300781 7.898438 5.601563 7.398438 6 L 5 5 C 4.800781 4.898438 4.5 5 4.398438 5.199219 L 2.398438 8.699219 C 2.199219 9 2.199219 9.300781 2.5 9.398438 L 4.601563 11 C 4.601563 11.300781 4.5 11.699219 4.5 12 C 4.5 12.300781 4.5 12.699219 4.601563 13 L 2.5 14.5 C 2.300781 14.601563 2.199219 14.898438 2.398438 15.199219 L 4.398438 18.699219 C 4.5 19 4.800781 19.101563 5 19 L 7.398438 17.898438 C 7.898438 18.300781 8.601563 18.699219 9.199219 18.898438 L 9.5 21.5 C 9.5 21.800781 9.699219 22 10 22 L 14 22 C 14.300781 22 14.5 21.800781 14.5 21.5 L 14.800781 18.898438 C 15.5 18.601563 16.101563 18.300781 16.601563 17.898438 L 19 19 C 19.199219 19.101563 19.5 19 19.601563 18.800781 L 21.601563 15.300781 C 21.699219 15.101563 21.699219 14.800781 21.5 14.601563 Z M 12 16 C 9.800781 16 8 14.199219 8 12 C 8 9.800781 9.800781 8 12 8 C 14.199219 8 16 9.800781 16 12 C 16 14.199219 14.199219 16 12 16 Z "/>
          </g>
          </svg>
          `,
          }}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View >
  );
}

const BottomBarView = (props: Props) => (
  <SafeAreaView style={styles.viewContainer}>
    {displayButtonTabs()}
    <Image
      style={styles.imageBackground}
      source={barBackground}
    />
    {displayIcons(props.currentBottomBarTab, props.onSelectTab)}


  </SafeAreaView>
);

export default BottomBarView;
