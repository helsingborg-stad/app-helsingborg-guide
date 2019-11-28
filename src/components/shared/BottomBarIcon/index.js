// @flow

import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import Home from "../../shared/svg/home";
import Calendar from "../../shared/svg/calendar";
import Settings from "../../shared/svg/settings";
import styles from "./style";
import { AnalyticsUtils } from "../../../utils/";
import NavigatorService from "../../../services/navigationService";
import LangService from "../../../services/langService";

const selectedColor: string = "#ffffffff";
const inactiveColor: string = "#d6aacdff";

const eventCalendarURL = "https://kalender.helsingborg.se/event/?simpleAppView";

function getIcon(index: number, color: string) {
  switch (index) {
    case 0:
      return (
        <View style={styles.iconView}>
          <Home color={color} />
        </View>
      );
    case 1:
      return (
        <View style={styles.iconView}>
          <Calendar color={color} />
        </View>
      );
    case 2:
      return (
        <View style={styles.iconView}>
          <Settings color={color} />
        </View>
      );
    default:
      return null;
  }
}

function getText(index: number) {
  switch (index) {
    case 0:
      return LangService.strings.HOME;
    case 1:
      return LangService.strings.CALENDAR;
    case 2:
      return LangService.strings.SETTINGS;
    default:
      return null;
  }
}

type Props = {
  index: number,
  selected: boolean,
  selectBottomBarTab: any
};

class BottomBarIcon extends Component<Props> {
  getBottomBarIcon() {
    const color = this.props.selected ? selectedColor : inactiveColor;

    const bottomBarIcon = (
      <TouchableOpacity
        style={styles.touchableIcon}
        onPress={() => this.onTouchIcon(this.props.index, this.props.selected)}
      >
        {getIcon(this.props.index, color)}
        <Text style={[styles.text, { color }]}>
          {getText(this.props.index)}
        </Text>
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
          NavigatorService.reset("WebScreen", {
            url: eventCalendarURL,
            title: LangService.strings.CALENDAR
          });
          AnalyticsUtils.logEvent("open_url", { eventCalendarURL });
          break;
        case 2:
          NavigatorService.reset("SettingsScreen");
          break;
        default:
          break;
      }
    }

    this.props.selectBottomBarTab(index); // dispatch
  }

  render() {
    return this.getBottomBarIcon();
  }
}

export default BottomBarIcon;
