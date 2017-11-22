import React from "react";
import {
  Image,
  StyleSheet,
} from "react-native";
import LangService from "../services/langService";
import {
  Colors,
} from "./";

const guideIcon = require("../images/tab-bar/iconStartpageUnselected.png");
const downloadedIcon = require("../images/tab-bar/iconDownloads.png");
const settingsIcon = require("../images/tab-bar/iconSettings.png");

const styles = StyleSheet.create({
  iconActive: {
    tintColor: Colors.purple,
    width: 22,
    height: 22,
  },
  iconInactive: {
    tintColor: Colors.warmGrey,
    width: 22,
    height: 22,
  },
});

export default {
  guide: {
    tabBarLabel: () => LangService.strings.GUIDE.toUpperCase(),
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <Image
        source={guideIcon}
        style={focused ? styles.iconActive : styles.iconInactive}
      />
    ),
  },
  downloaded: {
    tabBarLabel: () => LangService.strings.OFFLINE_CONTENT_TITLE.toUpperCase(),
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <Image
        source={downloadedIcon}
        style={focused ? styles.iconActive : styles.iconInactive}
      />
    ),
  },
  settings: {
    tabBarLabel: () => LangService.strings.SETTINGS.toUpperCase(),
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <Image
        source={settingsIcon}
        style={focused ? styles.iconActive : styles.iconInactive}
      />
    ),
  },
};
