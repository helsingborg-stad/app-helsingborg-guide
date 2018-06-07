// @flow

import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import SVGImage from "react-native-remote-svg";
import styles from "./style";
import { AnalyticsUtils } from "../../../utils/";
import NavigatorService from "../../../services/navigationService";

const selectedColor: string = "#ffffffff";
const inactiveColor: string = "#ffffffaa";

const eventCalendarURL = "https://kalender.helsingborg.se/event/page/2/?simpleAppView";

function getSettingsIcon(color: string) {
  return ({
    uri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
<g id="surface1">
<path style=" " fill=${color} d="M 19.398438 13 C 19.398438 12.699219 19.5 12.300781 19.5 12 C 19.5 11.699219 19.5 11.300781 19.398438 11 L 21.5 9.5 C 21.699219 9.398438 21.800781 9.101563 21.601563 8.800781 L 19.601563 5.300781 C 19.5 5 19.199219 4.898438 19 5 L 16.601563 6.101563 C 16.101563 5.699219 15.398438 5.300781 14.800781 5.101563 L 14.5 2.5 C 14.5 2.199219 14.300781 2 14 2 L 10 2 C 9.699219 2 9.5 2.199219 9.5 2.5 L 9.199219 5 C 8.5 5.300781 7.898438 5.601563 7.398438 6 L 5 5 C 4.800781 4.898438 4.5 5 4.398438 5.199219 L 2.398438 8.699219 C 2.199219 9 2.199219 9.300781 2.5 9.398438 L 4.601563 11 C 4.601563 11.300781 4.5 11.699219 4.5 12 C 4.5 12.300781 4.5 12.699219 4.601563 13 L 2.5 14.5 C 2.300781 14.601563 2.199219 14.898438 2.398438 15.199219 L 4.398438 18.699219 C 4.5 19 4.800781 19.101563 5 19 L 7.398438 17.898438 C 7.898438 18.300781 8.601563 18.699219 9.199219 18.898438 L 9.5 21.5 C 9.5 21.800781 9.699219 22 10 22 L 14 22 C 14.300781 22 14.5 21.800781 14.5 21.5 L 14.800781 18.898438 C 15.5 18.601563 16.101563 18.300781 16.601563 17.898438 L 19 19 C 19.199219 19.101563 19.5 19 19.601563 18.800781 L 21.601563 15.300781 C 21.699219 15.101563 21.699219 14.800781 21.5 14.601563 Z M 12 16 C 9.800781 16 8 14.199219 8 12 C 8 9.800781 9.800781 8 12 8 C 14.199219 8 16 9.800781 16 12 C 16 14.199219 14.199219 16 12 16 Z "/>
</g>
</svg>
`,
  });
}

function getHomeIcon(color: string) {
  return (
    {
      uri: `data:image/svg+xml;utf8,<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs></defs>
      <g id="HOME" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
          <path d="M3,22 L9.05908203,22 L9.05908203,16.0106017 C9.03816732,13.3368672 10.0184733,12 12,12 C13.9815267,12 14.97229,13.3368672 14.97229,16.0106017 L14.97229,22 L21,22 C21.5522847,22 22,21.5522847 22,21 L22,9.10243292 C22,8.74526696 21.8095065,8.41521622 21.5002415,8.23654699 L12.5002415,3.03704748 C12.1907177,2.85822872 11.8092823,2.85822872 11.4997585,3.03704748 L2.4997585,8.23654699 C2.19049353,8.41521622 2,8.74526696 2,9.10243292 L2,21 C2,21.5522847 2.44771525,22 3,22 Z" id="Path-3" stroke=${color} stroke-width="2"></path>
      </g>
    </svg>`,
    }
  );
}

function getCalendarIcon(color: string) {
  return (
    {
      uri: `data:image/svg+xml;utf8,<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs></defs>
    <g id="CALENDAR" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect id="Rectangle-2" stroke=${color} stroke-width="2" x="3" y="6" width="18" height="15" rx="1"></rect>
      <path d="M8.03515625,7.91052246 L8.03515625,2.91052246" id="Path-5" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M16,7.91052246 L16,2.91052246" id="Path-5" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <circle id="Oval" fill=${color} cx="8" cy="11" r="1"></circle>
      <circle id="Oval" fill=${color} cx="12" cy="11" r="1"></circle>
      <circle id="Oval" fill=${color} cx="16" cy="11" r="1"></circle>
      <circle id="Oval" fill=${color} cx="8" cy="14" r="1"></circle>
      <circle id="Oval" fill=${color} cx="12" cy="14" r="1"></circle>
      <circle id="Oval" fill=${color} cx="16" cy="14" r="1"></circle>
      <circle id="Oval" fill=${color} cx="8" cy="17" r="1"></circle>
      <circle id="Oval" fill=${color} cx="12" cy="17" r="1"></circle>
      <circle id="Oval" fill=${color} cx="16" cy="17" r="1"></circle>
    </g>
    </svg>`,
    }
  );
}

function getIcon(index: number, color: string) {
  switch (index) {
    case 0:
      return getHomeIcon(color);
    case 1:
      return getCalendarIcon(color);
    case 2:
      return getSettingsIcon(color);
    default: return null;
  }
}

type Props = {
  index: number,
  selected: boolean,
  selectBottomBarTab: any,
}

class BottomBarIcon extends Component<Props> {
  getBottomBarIcon() {
    const color = this.props.selected ? selectedColor : inactiveColor;

    const bottomBarIcon = (
      <TouchableOpacity style={styles.touchableIcon} onPress={() => this.onTouchIcon(this.props.index, this.props.selected)}>
        <SVGImage
          source={getIcon(this.props.index, color)}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
    return bottomBarIcon;
  }

  onTouchIcon(index: number, selected: boolean) {
    if (!selected) {
      switch (index) {
        case 0:
          NavigatorService.reset("HomeScreen");
          break;
        case 1:
          NavigatorService.reset("WebScreen", { url: eventCalendarURL });
          AnalyticsUtils.logEvent("open_url", { eventCalendarURL });
          break;
        case 2:
          NavigatorService.reset("SettingsScreen");
          break;
        default: break;
      }
    }

    this.props.selectBottomBarTab(index); // dispatch
  }

  render() {
    return this.getBottomBarIcon();
  }
}

export default BottomBarIcon;
